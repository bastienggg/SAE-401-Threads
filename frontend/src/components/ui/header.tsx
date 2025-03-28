export default function Header() { 
    return (
        <div className="flex flex-row item-center p-2 justify-center w-full  gap-4 top-0 bg-white z-10 border-b-2 border-b-neutral-900">
          <img src="/public/parlatz_logo.svg" alt="" className="w-10 aspect-square"/>
          <h1 className="font-extrabold text-3xl text-neutral-900">Parlatz</h1>
      </div>
    );
}

