const isEmailRgex = ({str}) => {
    const isEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        str
      );
    return isEmail;
  };

  const userAuthentication =({ name, email, userName, password })=>{
      return new Promise((resolve,reject)=>{
        if(!name || !email || !userName || !password) reject("missing crendential");
          
    if (typeof name !== "string") reject("name is not a text");
    if (typeof email !== "string") reject("email is not a text");
    if (typeof password !== "string") reject("password is not a text");
    if (typeof userName !== "string") reject("username is not a text");

    if (userName.length < 3 || userName.length > 50)
      reject("username length should be 3-50");

    if (!isEmailRgex({str:email})) reject("Email format is incorect");

    resolve();
      })
  }
  module.exports={userAuthentication,isEmailRgex} ;