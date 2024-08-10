interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}
async function ThreadsTab({ currentUserId, accountId, accountType }: Props) {
  ///ToDO:Fetch Profile threads
  return <section>ThreadsTab</section>;
}

export default ThreadsTab;
