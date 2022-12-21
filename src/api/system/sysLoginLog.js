import request from "@/utils/request"

//登录日志相关api

const api_name = "admin/system/sysLoginLog"

export default  {
    //获取登录日志列表
    getLoginLogList(page,limit,queryObj){
        debugger
        console.log("api方法中的query",queryObj);
        return request({
            url: `${api_name}`+"/"+`${page}`+"/"+`${limit}`,
            method: "get",
            params:queryObj
        })
    },
}
