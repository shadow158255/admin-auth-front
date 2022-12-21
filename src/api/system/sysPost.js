import request from "@/utils/request"

//部门管理相关api

const api_name = '/admin/system/sysPost'

export default {
    //获取列表数据/条件查询
    queryPostList(queryObj,page,limit){
        return request({
            url: `${api_name}`+"/queryPostList/"+`${page}`+"/"+`${limit}`,
            method: "get",
            params: queryObj
        })
    },
    //增加岗位
    addPost(sysPostObj){
        return request({
            url: `${api_name}`+"/addPost",
            method: "post",
            data: sysPostObj
        })
    },
    //删除岗位
    deletePost(id){
        return request({
            url: `${api_name}`+"/deleteById/"+`${id}`,
            method: "delete"
        })
    },
    //根据id获取岗位
    selectById(id){
        return request({
            url:  `${api_name}`+"/queryPostById/"+`${id}`,
            method: "get"
        })
    },
    //修改岗位信息
    updatePost(postObj){
        return request({
            url: `${api_name}`+"/updatePost",
            method: "post",
            data: postObj
        })
    },
    //更改岗位状态
    changeStatus(id,status){
        return request({
            url: `${api_name}`+"/changeStatus/"+`${id}`+"/"+`${status}`,
            method: "get"
        })
    }
}
