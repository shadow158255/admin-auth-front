import request from "@/utils/request"

//操作日志api
const api_name = "admin/system/sysOperLog"

export default {
    //获取操作分页列表
    getOperList(page,limit,queryObj){
        return request({
            url: `${api_name}`+"/"+`${page}`+"/"+`${limit}`,
            method: "get",
            params: queryObj
        })
    },
    //根据id获取操作日志信息
    selectById(id){
        return request({
            url: `${api_name}`+"/get/"+`${id}`
        })
    }
}
