import Navbar from "../../components/layout/Navbar";
import PageContainer from "../../components/layout/PageContainer";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ActivityList from "../../components/profile/ActivityList";

const activities = [
  {
    id: "1",
    title: "Bought YES on MrBeast market",
    timestamp: "2 mins ago",
  },
  {
    id: "2",
    title: "Claimed 142 USDC rewards",
    timestamp: "1 hour ago",
  },
  {
    id: "3",
    title: "Bought NO on X follower market",
    timestamp: "Yesterday",
  },
];

export default function ProfilePage() {
  return (
    <>
      <Navbar />

      <PageContainer>
        <div className="space-y-8">
          <ProfileHeader
            avatar="https://placehold.co/200x200"
            username="Leo"
            wallet="0x8A91...4dF2"
            accuracy="71%"
            marketsParticipated={48}
            totalWinnings="+2,413 USDC"
          />

          <ActivityList activities={activities} />
        </div>
      </PageContainer>
    </>
  );
}
