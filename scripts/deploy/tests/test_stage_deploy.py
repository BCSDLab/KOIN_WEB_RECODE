import tempfile,pathlib,subprocess,os,tarfile
source=(pathlib.Path(__file__).resolve().parents[1]/'server/stage-deploy.sh').read_text()
with tempfile.TemporaryDirectory() as tmp:
 root=pathlib.Path(tmp); base=root/'stage'; (base/'releases/old').mkdir(parents=True); (base/'current').symlink_to(base/'releases/old'); bins=root/'bin'; bins.mkdir()
 mocks={'flock':'exit 0','sleep':'exit 0','mv':'''python3 -c 'import os,sys; os.replace(sys.argv[1],sys.argv[2])' "$2" "$3"''','sudo':'''echo "$*" >> "$TEST_ROOT/commands"
if [ "$1" = /usr/bin/systemctl ] && [ "$2" = start ] && [ -f "$TEST_ROOT/fail-start" ]; then rm "$TEST_ROOT/fail-start"; exit 1; fi
exit 0''','curl':'''target=$(readlink "$TEST_ROOT/stage/current")
if [ -f "$TEST_ROOT/fail-health" ] && [ "${target##*/}" != old ]; then exit 22; fi
printf '{"status":"ok","environment":"stage","release":"sha"}' '''}
 for name,body in mocks.items():
  p=bins/name; p.write_text('#!/bin/bash\n'+body+'\n'); p.chmod(0o755)
 script=root/'deploy.sh'; script.write_text(source.replace('DEPLOY_DIR=/usr/local/koin/stage','DEPLOY_DIR='+str(base)))
 package=root/'package'; package.mkdir()
 for f in ['.next/BUILD_ID','package.json','.pnp.cjs','.pnp.loader.mjs','.env','.yarn/releases/yarn.cjs']:
  p=package/f;p.parent.mkdir(parents=True,exist_ok=True);p.write_text('fixture')
 (package/'.yarnrc.yml').write_text('yarnPath: .yarn/releases/yarn.cjs\n');(package/'public').mkdir();(package/'.yarn/cache').mkdir()
 archive=root/'archive.tar.gz'
 def pack():
  with tarfile.open(archive,'w:gz') as t:
   for p in package.iterdir():t.add(p,arcname=p.name)
 env=dict(os.environ,PATH=str(bins)+':'+os.environ['PATH'],TEST_ROOT=str(root))
 def run(name,expect):
  p=subprocess.run(['bash',str(script),str(archive),name,'sha'],env=env,capture_output=True,text=True)
  assert (p.returncode==0)==expect,(name,p.stdout,p.stderr)
  print(name+': PASS')
 pack();run('success',True);assert (base/'current').resolve()==(base/'releases/success').resolve()
 (base/'current').unlink();(base/'current').symlink_to(base/'releases/old')
 pack();(root/'fail-health').touch();run('health-failure',False);assert (base/'current').resolve()==(base/'releases/old').resolve();(root/'fail-health').unlink();assert not (base/'releases/health-failure').exists() and not archive.exists()
 pack();(root/'fail-start').touch();run('start-failure',False);assert (base/'current').resolve()==(base/'releases/old').resolve();assert not (base/'releases/start-failure').exists() and not archive.exists()
 (package/'.next/BUILD_ID').unlink();pack();before=(root/'commands').read_text();run('invalid-package',False);assert (root/'commands').read_text()==before;assert not (base/'releases/invalid-package').exists() and not archive.exists()
 archive.write_text('broken');run('corrupt-archive',False);assert (base/'current').resolve()==(base/'releases/old').resolve()
 (package/'.next/BUILD_ID').write_text('fixture')
 for i,name in enumerate(['old','success','r1','r2','r3','r4']):
  d=base/'releases'/name;d.mkdir(exist_ok=True)
  if name!='r4':(d/'.release-complete').touch()
  os.utime(d,(100+i,100+i))
 pack();run('prune',True);assert sorted(p.name for p in (base/'releases').iterdir())==['old','prune']
 def prune_only():
  p=subprocess.run(['bash','-s','--','--prune-only'],input=script.read_text(),env=env,capture_output=True,text=True);assert p.returncode==0,(p.stdout,p.stderr)
  return p.stdout
 for name,mtime,complete in [('r5',300,False),('r6',4102444800,True)]:
  d=base/'releases'/name;d.mkdir()
  if complete:(d/'.release-complete').touch()
  os.utime(d,(mtime,mtime))
 before=(root/'commands').read_text();prune_only()
 assert sorted(p.name for p in (base/'releases').iterdir())==['prune','r6'] and (root/'commands').read_text()==before;print('prune-only: PASS')
 for name,mtime in [('locked',4102444900),('stale',200)]:
  d=base/'releases'/name;(d/'sub').mkdir(parents=True);(d/'sub/file').write_text('x');os.utime(d,(mtime,mtime))
 (base/'releases/locked/sub').chmod(0o555)
 try:
  out=prune_only();assert 'WARN' in out and not (base/'releases/stale').exists(),out
 finally:(base/'releases/locked/sub').chmod(0o755)
 print('prune-partial-failure: PASS')
