import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
       user:User,
      id: string;
      name: string;
      email: string;
      schoolId: string ;  
      role:string
    
  }
  interface User {
    id: string;
    name: string;
    email: string;
    schoolId: string ;  
    role:string,
    schoolId:string,

}

}

