(function() {
    // 统一接口配置
    $.api = {
        /*公共*/
        common: {
            getProjectList: new Api({
                serviceName: './components/nav/data/project.json'
            }),
            //登录
            loginApp: new Api({
                serviceName: `${API_URL}/ewindsys/ewindUser/login`
            }),
            //获取地区市用户信息
            getDistUserInfo: new Api({
                serviceName: `${API_URL}/project_info/projectMenu`
            })
        },

        /*项目管理*/
        projectInfo: {
            /*项目列表*/
            overview: {
                add: new Api({
                    serviceName: `${API_URL}/project_info/overview/add`
                }),
                update: new Api({
                    serviceName: `${API_URL}/project_info/overview/update`
                }),
                delflag: new Api({
                    serviceName: `${API_URL}/project_info/overview/delflag`
                }),
            },
            findById: new Api({
                serviceName: `${API_URL}/project_info/find`
            }),
            update: new Api({
                serviceName: `${API_URL}/project_info/update`
            }),
            //前期资料
            earlierStage: {
                find: new Api({
                    serviceName: `${API_URL}/project_info/earlierStage/find`
                }),
                update: new Api({
                    serviceName: `${API_URL}/project_info/earlierStage/update`
                }),
            },
            //参建主体
            mainBuilding: {
                edit: new Api({
                    serviceName: `${API_URL}/project_info/mainBuilding/edit`
                }),
                status: new Api({
                    serviceName: `${API_URL}/project_info/mainBuilding/status`
                }),
                delete: new Api({
                    serviceName: `${API_URL}/project_info/mainBuilding/delete`
                }),
            },
            //参建主体
            bid: {
                dataList: new Api({
                    serviceName: `${API_URL}/project_info/bid/dataList`
                }),
                edit: new Api({
                    serviceName: `${API_URL}/project_info/bid/edit`
                }),
                delete: new Api({
                    serviceName: `${API_URL}/project_info/bid/delete`
                }),
            },
            //验收节点 里程碑
            milestone: {
                dataList: new Api({
                    serviceName: `${API_URL}/project_info/milestone/dataList`
                }),
                edit: new Api({
                    serviceName: `${API_URL}/project_info/milestone/edit`
                }),
                delete: new Api({
                    serviceName: `${API_URL}/project_info/milestone/delete`
                }),
            },
            //验收节点 里程碑
            investPlan: {
                dataList: new Api({
                    serviceName: `${API_URL}/project_info/investPlan/dataList`
                }),
                edit: new Api({
                    serviceName: `${API_URL}/project_info/investPlan/edit`
                }),
                delete: new Api({
                    serviceName: `${API_URL}/project_info/investPlan/delete`
                }),
            },
            //设计变更
            designChange: {
                dataList: new Api({
                    serviceName: `${API_URL}/project_info/designChange/dataList`
                }),
                edit: new Api({
                    serviceName: `${API_URL}/project_info/designChange/edit`
                }),
                delete: new Api({
                    serviceName: `${API_URL}/project_info/designChange/delete`
                }),
            },
            //合同管理
            contract: {
                dataList: new Api({
                    serviceName: `${API_URL}/project_info/contract/dataList`
                }),
                edit: new Api({
                    serviceName: `${API_URL}/project_info/contract/edit`
                }),
                delete: new Api({
                    serviceName: `${API_URL}/project_info/contract/delete`
                }),
            },
            //项目工程划分
            divde: {
                dataList: new Api({
                    serviceName: `${API_URL}/project_info/divde/dataList`
                }),
                edit: new Api({
                    serviceName: `${API_URL}/project_info/divde/edit`
                }),
                delete: new Api({
                    serviceName: `${API_URL}/project_info/divde/delete`
                }),
            },
        },
        /*工程质量*/
        qa: {
            qaTest: {
                add: new Api({
                    serviceName: `${API_URL}/qa/qaTest/save`
                }),
                delflag: new Api({
                    serviceName: `${API_URL}/qa/qaTest/deleteAll`
                }),
                showEcharts: new Api({
                    serviceName: `${API_URL}/qa/qaTest/testEcharts`
                })
            },
            qaDefects: {
                add: new Api({
                    serviceName: `${API_URL}/qa/qaDefects/save`
                }),
                delflag: new Api({
                    serviceName: `${API_URL}/qa/qaDefects/deleteAll`
                })
            },
            qaIncident: {
                add: new Api({
                    serviceName: `${API_URL}/qa/qaIncident/save`
                }),
                delflag: new Api({
                    serviceName: `${API_URL}/qa/qaIncident/deleteAll`
                })
            },
            qaOverview: {
                showEcharts: new Api({
                    serviceName: `${API_URL}/qa/qaComAcceptance/overview`
                })
            },
            qaDygcys: {
                showEcharts: new Api({
                    serviceName: `${API_URL}/qa/qaPmDivde/showEcharts`
                })
            },
            qaComAcceptance: {
                add: new Api({
                    serviceName: `${API_URL}/qa/qaComAcceptance/save`
                })
            },
            qaPmDivde: {
                add: new Api({
                    serviceName: `${API_URL}/qa/qaPmDivde/save`
                })
            }

        },
        //文档管理
        doc: {
            //档案目录
            daml: {
                add: new Api({
                    serviceName: `${API_URL}/document/dmDocument/save`
                }),
                update: new Api({
                    serviceName: `${API_URL}/document/dmDocument/update`
                }),
                delet: new Api({
                    serviceName: `${API_URL}/document/dmDocument/delete`
                })
            }
        },
        //统计分析
        sa: {
            //质量与安全隐患统计表
            hiddenDanger: {
                add: new Api({
                    serviceName: `${API_URL}/sa/saHiddenDanger/save`
                }),
                update: new Api({
                    serviceName: `${API_URL}/sa/saHiddenDanger/update`
                }),
                deleteAll: new Api({
                    serviceName: `${API_URL}/sa/saHiddenDanger/deleteAll`
                })
            }
        },
        //进度管理
        jd: {
            tb: {
                show: new Api({
                    serviceName: `${API_URL}/schedule/scheduleManagement/show`
                }),
                edit: new Api({
                    serviceName: `${API_URL}/schedule/scheduleManagement/edit`
                })
            }
        }

    };
})();





// $.api.projectInfo.overview.exec(data,function(res){

// })