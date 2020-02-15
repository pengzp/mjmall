import request from "../request";
import requestURL from "../requestUrl";
import requestParam from "../requestParam";
//反馈 分页数据
export function lists(params) {
    return request({
      method: 'post',
      url: requestURL('/sys/complaint/list'),
      data: requestParam(params, 'post', true, 'json')
    })
  }
  //添加反馈
  export function insert(params){
    return request({
      method:'post',
      url:requestURL('/sys/complaint/addComplaint'),
      data:requestParam(params,'post',true,'json')
    })
  }
  //修改反馈
  export function update(params){
    return request({
      method:'post',
      url:requestURL('/sys/complaint/updateComplaint'),
      data:requestParam(params,'post',true,'json')
    })
  }
  //删除反馈
  export function less(params){
    return request({
      method:'post',
      url:requestURL('/sys/complaint/deleteComplaint'),
      data:requestParam(params,'post',true,'json')
    })
  }
  //通过id查询到数据
export function listById(params) {
    // debugger
    // var result = params;
    return request({
      method: 'post',
      url: requestURL('/sys/personnel/selectInfoByID'),
      data: requestParam(params, 'post', true, 'json')
    })
  }
  //通过wangwangNum查询历史记录
export function listByWangWangNum(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/complaint/selectInfoByWangWangNum'),
    data: requestParam(params, 'post', true, 'json')
  })
}
//上传文件
export function upload(params){
  return request({
    method:'post',
    url:requestURL('/sys/complaint/uploadFile'),
    data:requestParam(params,'post',true,'json')
  })
}
 //查询客诉大类
 export function selectLevel(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/complaint/selectLevel'),
    data: requestParam(params, 'post', true, 'json')
  })
}
 //通过wangwangNum查询历史记录
 export function getLevelName(params) {
  return request({
    method: 'post',
    url: requestURL('/sys/complaint/getLevelName'),
    data: requestParam(params, 'post', true, 'json')
  })
}