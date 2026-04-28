import { useCallback } from 'react';
import { sendClientError } from '@bcsdlab/koin';
import { useQueryClient } from '@tanstack/react-query';
import { RestrictedCallvanResponse } from 'api/callvan/entity';
import { callvanQueries } from 'api/callvan/queries';
import CallvanRestrictionModal from 'components/Callvan/components/CallvanRestrictionModal';
import { isCallvanRestrictedError } from 'components/Callvan/utils/callvanRestriction';
import { Portal } from 'components/modal/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';

export default function useCallvanRestrictionModal(token: string) {
  const portalManager = useModalPortal();
  const queryClient = useQueryClient();

  const open = useCallback(
    (restriction: RestrictedCallvanResponse) => {
      portalManager.open((portalOption: Portal) => (
        <CallvanRestrictionModal restriction={restriction} onClose={portalOption.close} />
      ));
    },
    [portalManager],
  );

  const openFromError = useCallback(
    async (error: unknown) => {
      if (!isCallvanRestrictedError(error)) return false;

      if (!token) return false;

      try {
        const restriction = await queryClient.fetchQuery(callvanQueries.restriction(token));
        if (restriction.is_restricted) {
          open(restriction);
          return true;
        }

        return false;
      } catch (restrictionError) {
        sendClientError(restrictionError);
        return false;
      }
    },
    [open, queryClient, token],
  );

  return { openFromError };
}
