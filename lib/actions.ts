'use server'

import { authOptions } from '@/utils/authOptions';
import { getServerSession } from "next-auth"
import prisma from '@/lib/db';




export const countSchools = async()=>{
    try{

        const schools = await prisma.school.count()

        return schools

    }catch(error){
        console.error("Failed to count schoools", error)
    }
}
export const countStudents= async()=>{
    try{

        const student = await prisma.student.count()

        return student

    }catch(error){
        console.error("Failed to count schoools", error)
    }
}
export const countTeachers= async()=>{
    try{

        const teachers = await prisma.teacher.count()

        return teachers

    }catch(error){
        console.error("Failed to count schoools", error)
    }
}
export const countSchoolDepartments = async()=>{

    const user = await getServerSession(authOptions)

    if(!user){
        return
    }

    try{

        const departmentsCount = await prisma.department.count({
            where:{
                schoolId:user.schoolId
            }
        })

        return departmentsCount

    }catch(error){
        console.error("Failed to count Departments in school", error)
    }
}
export const countSchoolStudents= async()=>{
    
    const user = await getServerSession(authOptions)

    if(!user){
        return
    }
    try{

        const students = await prisma.student.count({
            where:{
                schoolId:user.schoolId
            }
        })

        return students

    }catch(error){
        console.error("Failed to count schoools", error)
    }
}
export const countSchoolTeachers= async()=>{

    const user = await getServerSession(authOptions)

    if(!user){
        return
    }
    try{

        const teachers = await prisma.teacher.count({

            where:{
                schoolId:user.schoolId
            }
        })

        return teachers

    }catch(error){
        console.error("Failed to count schoools", error)
    }
}



export const fetchSchools = async() =>{
    try{

        const schools = await prisma.school.findMany({
            include:{
                schoolAdmin:true,
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        return schools

    }catch(error){
        console.error('Failed to fetch Schools', error)
    }
}

export const fetchSchoolDepartments = async()=>{

    try{

        const session = await getServerSession(authOptions)

    if(!session){
        return null
    }

    const schoolAdmin = await prisma.schoolAdmin.findUnique({
        where:{
            email:session.email
        }
    })

    if(!schoolAdmin){
        return
    }

    const departments = await prisma.department.findMany({
        where:{
            schoolId:schoolAdmin.schoolId
        },
        include:{
            admins:true
        },
        orderBy:{
            createdAt:'desc',
        }


    })

    return departments

    }catch(error){
        console.error('An error occurred in fetching school departments', error)
    }

    

}


export const fetchSchoolStudents = async()=>{
    try{
        const session = await getServerSession(authOptions)

        if(!session){
            return
        }

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where:{
                email:session.email
            }
        })

        if(!schoolAdmin){
            return
        }

        const students = await prisma.student.findMany({
            where:{
                schoolId:schoolAdmin.schoolId
            },
            include:{
                stream:{
                    include:{
                        class:true,
                    }
                }
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        return students

    }catch(error:any){
        console.error('Failed to create students in a school', error)
    }
}
export const fetchSingleStudent = async({id}:{id:string})=>{
    try{
        const session = await getServerSession(authOptions)

        if(!session){
            return
        }

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where:{
                email:session.email
            }
        })

        if(!schoolAdmin){
            return
        }

        const student = await prisma.student.findUnique({
            where:{
                schoolId:schoolAdmin.schoolId,
                id:id,
            },
            include:{
                stream:{
                    include:{
                        class:true,
                    }
                }
            },
           
        })

        return student

    }catch(error:any){
        console.error('Failed to fetch student in a school', error)
    }
}
export const fetchSchoolTeachers = async()=>{
    try{
        const session = await getServerSession(authOptions)

        if(!session){
            return
        }

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where:{
                email:session.email
            }
        })

        if(!schoolAdmin){
            return
        }

        const teachers = await prisma.teacher.findMany({
            where:{
                schoolId:schoolAdmin.schoolId
            },
            include:{
                departments:{
                    include:{
                        department:true,
                    }
                },
                subjects:{
                    include:{
                        subject:true,
                    }
                }
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        return teachers

    }catch(error:any){
        console.error('Failed to fetch teachers in a school', error)
    }
}
export const fetchSingleSchoolTeacher = async({id}:{id:string})=>{
    try{
        const session = await getServerSession(authOptions)

        if(!session){
            return
        }

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where:{
                email:session.email
            }
        })

        if(!schoolAdmin){
            return
        }

        const teacher = await prisma.teacher.findUnique({
            where:{
                schoolId:schoolAdmin.schoolId,
                id:id,
            },
            include:{
                departments:{
                    include:{
                        department:true,
                    }
                },
                subjects:{
                    include:{
                        subject:true,
                    }
                },
                classTeacher:true,
            },
        })

        return teacher

    }catch(error:any){
        console.error('Failed to fetch teachers in a school', error)
    }
}
export const fetchSchoolSubjects = async()=>{
    try{
        const session = await getServerSession(authOptions)

        if(!session){
            return
        }

        const schoolAdmin = await prisma.schoolAdmin.findUnique({
            where:{
                email:session.email
            }
        })

        if(!schoolAdmin){
            return
        }

        const subjects = await prisma.subject.findMany({
            where:{
                schoolId:schoolAdmin.schoolId
            },
            include:{
                teachers:{
                    include:{
                        teacher:true,
                    }
                }
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        return subjects

    }catch(error:any){
        console.error('Failed to fetch subjects in a school', error)
    }
}
