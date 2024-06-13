const hasCreatorPermissions = async ({ creatorId: _creatorId, requesterId: _requesterId }: {
  creatorId: string;
  requesterId: string;
}): Promise<boolean> => true;

export default hasCreatorPermissions;
