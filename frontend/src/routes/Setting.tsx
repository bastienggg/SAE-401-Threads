import Settings from "../components/setting/setting";
import Navbar from "../components/Navbar/Navbar";

export default function SettingPage() {
    return (
        <div>
            <Settings />
            <Navbar onPostCreated={() => { console.log("Post created"); }} />
        </div>
    );
}