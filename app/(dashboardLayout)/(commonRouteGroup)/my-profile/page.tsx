import MyProfileContent from "@/components/modules/Dashboard/Common/MyProfileContent";
import { ProfileSettingsContent } from "@/components/modules/Dashboard/Member/ProfileSettings/ProfileSettingsContent";
import { getUserInfo } from "@/service/auth.service";
import { UserInfo } from "@/types/user.types";

const MyProfilePage = async () => {
  return <ProfileSettingsContent />;
};

export default MyProfilePage;
