import axios from "axios";
import Content from "./Content";

export default async function Home() {
  const data = await axios.get('https://jsonplaceholder.typicode.com/users');


  return (
    <div className="h-full px-20 py-16 flex flex-col ">
      <p className="font-bold text-base border-b-2 border-gray-300 text-gray-700">
        User
      </p>
      <Content dataUser={data.data} />

    </div>
  );
}
