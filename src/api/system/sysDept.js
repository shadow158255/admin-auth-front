import request from "@/utils/request"

//部门相关api

const api_name = "admin/system/sysDept"

export default {
    //更改部门状态
    changeStatus(id,status){
        return request({
            url: `${api_name}`+"/changeStatus/"+`${id}`+"/"+`${status}`,
            method: "get"
        })
    },
    //部门树形列表数据请求
    deptTreeList(){
        return request({
            url: `${api_name}`+"/queryDeptTree",
            method: "get"
        })
    },
    //添加部门
    addDept(sysDept){
        return request({
            url: `${api_name}`+"/addDept",
            method: "post",
            data: sysDept
        })
    },
    //根据id删除部门
    deleteDeptByid(id){
        return request({
            url: `${api_name}`+"/deleteById/"+`${id}`,
            method: "delete"
        })
    },
    //修改部门
    updateDept(sysDept){
        return request({
            url:  `${api_name}`+"/updateDept",
            method: "post",
            data: sysDept
        })
    },
    //根据id查询部门
    selectById(id){
        return request({
            url: `${api_name}`+"/selectDeptById/"+`${id}`,
            method: "id"
        })
    }
}
