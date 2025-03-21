interface PostProps {
        content: string;
        pseudo: string;
        createdAt: string;
    }
    
    function timeSince(date: Date) {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
    
        if (interval > 1) {
            return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
    }
    
    export default function Post({ content, createdAt, pseudo }: PostProps) {
        if (!pseudo) {
            pseudo = "unknown";
        }
    
        return (
            <div className="flex flex-row gap-4 p-4 w-full bg-white rounded-md shadow-md my-2 justify-between items-start">
                    <img src="./src/assets/profil/default.jpg" alt="profil" className="w-9 aspect-square rounded-full " />
                    <div className="w-full flex flex-col gap-2">
                        <div className="flex flex-row items-center gap-2 justify-between w-full">
                        <p className="font-bold text-neutral-900">@{pseudo}
                        </p>
                        <p className="text-xs text-neutral-700">{timeSince(new Date(createdAt))} ago</p>
                        </div>
                        <p>{content}</p>
                    </div>
                </div>
        );
    }