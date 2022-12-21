/**
 * 角色相关请求的api
 */
import request from '@/utils/request'

const api_name = "/admin/system/sysRole"

export default{
    //批量删除
  batchDelete(ids){
    return request({
      //接口路径
      url: `${api_name}`+"/batchRemove",
      method: 'delete',
      data: ids
    })
  },
    /**
     * 获取分页列表（带搜索）
     */
    getRoleList(page,limit,queryObj){
        return request({
            url: `${api_name}`+"/"+`${page}`+"/"+`${limit}`,
            method: 'get',
            params: queryObj,
          })
    },
    //删除
  removeRole(id){
    return request({
      //接口路径
      url: `${api_name}`+"/deleteById/"+`${id}`,
      method: 'delete'
    })
  },
  //修改-根据id查询
  selectById(id){
    return request({
      //接口路径
      url: `${api_name}`+"/get/"+`${id}`,
      method: 'get',
    })
  },
   //修改-最终修改
   updateRole(roleObj){
    return request({
      //接口路径
      url: `${api_name}`+"/update",
      method: 'post',
      //传递jason格式参数使用data（后端接收参数加@requestBody时使用data，不加使用params）
      data:roleObj
    })
  },
  //添加
  addRole(roleObj){
    return request({
      //接口路径
      url: `${api_name}`+"/save",
      method: 'post',
      //传递jason格式参数使用data（后端接收参数加@requestBody时使用data，不加使用params）
      data:roleObj
    })
  },
  //根据用户id查询用户已分配的角色
  getRolesByUserId(userId) {
    return request({
      url: `${api_name}`+"/toAssign/"+`${userId}`,
      method: 'get'
    })
  },

  //分配角色
  assignRoles(assginRoleVo) {
    return request({
      url: `${api_name}`+"/doAssign",
      method: 'post',
      data: assginRoleVo
    })
  }
}
