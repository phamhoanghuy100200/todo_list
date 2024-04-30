'use client'

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { AiOutlineCheckSquare } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";

type Props = {
    dataUser: any;
}
const Content = ({ dataUser }: Props) => {

    const [userId, setUserId] = useState(0)
    const [userName, setuserName] = useState('')

    const [task, setTask] = useState<any>([])
    const [showUser, setShowUser] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const [countTask, setCountTask] = useState(0)

    useEffect(() => {
        //Lấy tất cả task theo người dùng
        const FetchingTask = async () => {
            setCountTask(0)
            setLoading(true)
            const taskData = await axios.get(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);

            //Sắp xếp theo true, false
            taskData.data.sort((a: any, b: any) => {
                if (a.completed && !b.completed) {

                    return 1;
                } else if (!a.completed && b.completed) {

                    return -1;
                } else {
                    return 0
                }
            })
            //Đếm task
            taskData.data.map((a: any) => {
                if (a.completed) setCountTask((current) => current + 1)
            })



            setTask(taskData.data)
            setLoading(false)
        }
        FetchingTask()
    }, [userId])

    //Sửa completed của task
    const handleEdit = async (taskId: number) => {
        setLoading(true)

        const newtask1 = await axios.patch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, { completed: true })

        const newTask = task.map((elem: any) => {
            if (elem.id === newtask1.data.id) {
                return { ...elem, completed: true }
            }
            return elem
        })

        //Sắp xếp theo true, false
        newTask.sort((a: any, b: any) => {
            if (a.completed && !b.completed) {
                return 1;
            } else if (!a.completed && b.completed) {
                return -1;
            } else {
                return 0
            }
        })
        setCountTask((current) => current + 1)
        setTask(newTask)
        setLoading(false)

    }

    //hiển thị danh sách user
    const toggleUserMenu = useCallback(() => {
        setShowUser((current) => !current)
    }, [])

    //lấy user theo userId
    const getUserId = useCallback((id: number, name: string) => {
        setUserId(id)
        setuserName(name)
        setShowUser(false)

    }, [])
    return (
        <>
            <div className="flex flex-row gap-2 cursor-pointer items-center relative transitions">
                <div onClick={() => toggleUserMenu()}>
                    <input className="py-2 px-2 cursor-pointer focus:border-sky-300 hover:border-sky-300 w-62 mt-4 h-auto border-2 border-gray-100 rounded-md"
                        autoComplete="off"
                        role="combobox"
                        list="nameUser"
                        onChange={(e) => setuserName(e.target.value)}
                        placeholder={userName === '' ? 'Select user' : userName}
                    ></input>
                    <BsChevronDown size={20} className={`absolute left-52 top-6  transition ${showUser ? 'rotate-180' : 'rotate-0'}`} />

                </div>


                <div className=" gap-2   hover:text-grap-300 cursor-pointer flex items-center  ">
                    {showUser && (

                        <div className="bg-white w-[237px] max-h-[300px] overflow-auto shadow-md absolute top-16 rounded-md left-0 flex flex-col   gap-3">
                            {dataUser.map((item: any) => (
                                <div key={item.id}>
                                    <div onClick={() => getUserId(item.id, item.name)} className={`${userId === item.id ? 'bg-sky-300' : ''} text-center py-1  mx-1 rounded-md  hover:bg-gray-200`}>
                                        {item.name}
                                    </div>

                                </div>

                            ))}
                        </div>
                    )}
                </div>
            </div>

            <p className="font-bold text-base border-b-2 border-gray-300 text-gray-700 mt-4">Task</p>
            <div className="h-[500px] w-[500px] md:w-[800px] lg:w-[1300px] overflow-auto border-2 border-gray-300 rounded-md mt-4 mr-auto bg-gray-100">
                {isLoading && <div className=" w-full flex items-center justify-center mt-4 " ><FaSpinner className="animate-spin" size={15} /></div>}
                {task.length > 0 ? (
                    <div>
                        <ul className="ml-4">
                            {task.map((item: any) => (
                                <div key={item.id} className="w-full flex flex-row items-center py-2 gap-x-2 border-b-2 border-gray-300  ">
                                    {item.completed ? <AiOutlineCheckSquare size={15} className="text-green-500" />
                                        : <AiOutlinePlusSquare size={15} className="text-orange-500" />
                                    }
                                    <li className="  rounded-md flex flex-row ">
                                        <p>
                                            {item.title}
                                        </p>

                                    </li>
                                    {!item.completed
                                        && <div className="relative ml-auto pr-2 flex">
                                            <button onClick={() => { handleEdit(item.id) }} className="flex items-center gap-2 w-auto border-2 hover:bg-sky-200 border-sky-300 bg-white rounded-md px-2 py-1">
                                                {isLoading && <div className=" flex items-center justify-center " ><FaSpinner className="animate-spin" size={15} /></div>}
                                                Mark done
                                            </button>
                                        </div>
                                    }
                                </div>
                            ))}
                        </ul>
                    </div>
                ) : <p className="w-full pt-5  pl-5 text-gray-400">No data</p>
                }
            </div>
            <div>Done:{countTask}/{task.length}</div>

        </>
    );
}

export default Content;

