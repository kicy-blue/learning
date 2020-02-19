import axios from './axios'

let urlPrefix = '//mm.yangche51.com'
let urlPrefix2 = '//app.yangche51.com'
// axios示例
export const GetQuestionType = (params) => axios.get(`${urlPrefix2}/6_1/Qa/GetQuestionType.ashx`, {params:params});

export const GetQuestionListByType = (params) => axios.post(`${urlPrefix2}/6_1/Qa/GetQuestionListByType.ashx`, params);

