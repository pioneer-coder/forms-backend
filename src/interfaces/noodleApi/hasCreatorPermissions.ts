import type ApiDefinitions from './apiDefinitions/creators.js';
import axiosClient from './axiosClient.js';

type ThisApi = ApiDefinitions['/webhooks/creators/{creatorId}/has-permission']['GET'];
type Input = ThisApi['params'] & ThisApi['query'];
type Output = ThisApi['response'];

const hasCreatorPermissions = async ({ creatorId, personId, scope }: Input): Promise<Output> => {
  const response = await axiosClient.get(`/webhooks/creators/${creatorId}/has-permission`, {
    params: { personId, scope },
  });
  return response.data;
};

export default hasCreatorPermissions;
