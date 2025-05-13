export interface GroupIdParams {
  params: Promise<{
    groupId: string;
    joinCode?: string;
  }>;
}
