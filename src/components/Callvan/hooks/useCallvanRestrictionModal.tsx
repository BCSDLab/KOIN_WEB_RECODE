import { useCallback } from 'react';
import { sendClientError } from '@bcsdlab/koin';
import { useQueryClient } from '@tanstack/react-query';
import { CallvanRestrictionResponse } from 'api/callvan/entity';
import { callvanQueries } from 'api/callvan/queries';
import CallvanRestrictionModal from 'components/Callvan/components/CallvanRestrictionModal';
import { isCallvanRestrictedError } from 'components/Callvan/utils/callvanRestriction';
import { Portal } from 'components/modal/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';

export default function useCallvanRestrictionModal(token: string) {
  const portalManager = useModalPortal();
  const queryClient = useQueryClient();

  const open = useCallback(
    (restriction: CallvanRestrictionResponse | null) => {
      portalManager.open((portalOption: Portal) => (
        <CallvanRestrictionModal restriction={restriction} onClose={portalOption.close} />
      ));
    },
    [portalManager],
  );

  const openFromError = useCallback(
    async (error: unknown) => {
      if (!isCallvanRestrictedError(error)) return false;

      if (!token) {
        open(null);
        return true;
      }

      try {
        const restriction = await queryClient.fetchQuery(callvanQueries.restriction(token));
        open(restriction.is_restricted ? restriction : null);
      } catch (restrictionError) {
        sendClientError(restrictionError);
        open(null);
      }

      return true;
    },
    [open, queryClient, token],
  );

  return { openFromError };
}
