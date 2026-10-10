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
 pack();(root/'fail-health').touch();run('health-failure',False);assert (base/'current').resolve()==(base/'releases/old').resolve();(root/'fail-health').unlink()
 pack();(root/'fail-start').touch();run('start-failure',False);assert (base/'current').resolve()==(base/'releases/old').resolve()
 (package/'.next/BUILD_ID').unlink();pack();before=(root/'commands').read_text();run('invalid-package',False);assert (root/'commands').read_text()==before
 archive.write_text('broken');run('corrupt-archive',False);assert (base/'current').resolve()==(base/'releases/old').resolve()
