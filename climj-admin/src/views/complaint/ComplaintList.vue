<template>
  <div>
    <Row style="margin-top: 15px" type="flex" >
      <Col span="3" style="margin-left: 5px">
        <span ><Button type="primary" @click="addModal" icon="search">增加</Button></span>
        <span ><Button  type="error"  @click="this.delete" icon="trash-a">批量删除</Button></span>
      </Col>
      <Col span="4" style="margin-left: 0px">
        <i-select @on-change="searchComplaint" v-model="params.status" placeholder="选择状态" filterable style="width:200px">
        <Option value="0">待审核</Option>
        <Option value="1">已审核</Option>
        <Option value="2">待审定</Option>
        <Option value="-1">全部</Option>
      </i-select>
      </Col>
      <Col span="4" offset="10">
        <Input v-model="params.keyword" placeholder="请输入客户名,店长"  :clearable="isClearAble"/>
      </Col>

      <Col span="1" style="margin-left: 5px">
        <span ><Button type="primary" @click="searchComplaint" icon="search">搜索</Button></span>
      </Col>
    </Row>
    <Row style="margin-top: 25px">
      <Table border ref="selection"
             :columns="columns1"
             :current="params.pageNum"
             @on-selection-change="selectionChange"
             :data="data1" width=100%>
      </Table>
    </Row>
    <Row>
      <Col/>
        <Button @click="handleSelectAll(true)">全选</Button>
        <Button @click="handleSelectAll(false)">取消全选</Button>
    </Row>

    <Row>
      <div style="float:right">
        <Page :total="totalCount" :page-size="params.pagesize"
              loading show-sizer @on-change="pageChange"
              @on-page-size-change="sizeChange"
        />
      </div>
    </Row>

    <Modal v-model="showAddModal"
           @on-ok="save"
           @on-cancel="cancel">
      <h3 slot="header" style="color:#2D8CF0">增加信息</h3>
      <Form :model="showAddForm" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser" :rules="addForm">
        <!-- <FormItem  label="ID" prop="pkId" >
           <Input v-model="showAddForm.pkId" :disabled="isDisabled"></Input>
         </FormItem>-->

        <FormItem  label="投诉客户" prop="wangwangnum" >
          <Input v-model="showAddForm.wangwangnum"
                 placeholder="请输入投诉客户" style="width: 300px" :clearable="isClearAble"/>
        </FormItem>
        <FormItem  label="投诉渠道" prop="channel">
          <Select v-model="showAddForm.channel" style="width: 300px"  placeholder="请选择投诉渠道">
                <Option value="1">招商京东</Option>
                <Option value="2">招商淘宝</Option>
                <Option value="3">综管部</Option>
                <Option value="4">企划部</Option>
                <Option value="5">京东官方投诉</Option>
                <Option value="6">京东差评投诉</Option>
                <Option value="7">淘宝官方投诉</Option>
                <Option value="8">其他</Option>
            </Select>
        </FormItem>
        <FormItem  label="投诉内容" prop="content" >
          <Input v-model="showAddForm.content"
                 placeholder="请输入退款原因" type="textarea" :autosize="{minRows: 5,maxRows: 5}" style="width: 300px" :clearable="isClearAble"/>
        </FormItem>
        <FormItem label="投诉日期" prop="complaintdate">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="showAddForm.complaintdate" placeholder="Select date and time(Excluding seconds)" style="width: 300px"></DatePicker>
        </FormItem>
        <FormItem label="场景还原" prop="scenerestoration">
          <Upload
                ref="upload" name="file"
                action="http://localhost:8090/sys/complaint/upload"
                :on-success="handleSuccess"
                :on-format-error="handleFormatError">
              <i-button type="primary" icon="ios-cloud-upload-outline">上传文件</i-button>
          </Upload>
       </FormItem>
        <FormItem  label="备注" prop="remarks" >
          <Input v-model="showAddForm.remarks"
                 placeholder="备注" style="width: 300px"  type="textarea" :autosize="{minRows: 5,maxRows: 5}" :clearable="isClearAble"/>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="showModal"
           @on-ok="saveTable"
           @on-visible-change="resetData"
           @on-cancel="cancelTable">
      <h3 slot="header" style="color:#2D8CF0">历史记录</h3>
      <Table border ref="selection"
             :columns="columns2"
             :current="params.pageNum"
             @on-selection-change="selectionChange"
             :data="data2" width=100%>
      </Table>
    </Modal>
     <Modal v-model="reViewModal"
           @on-ok="saveEdit"
           @on-cancel="cancelEdit">
      <h3 slot="header" style="color:#2D8CF0">审核</h3>
      <Form :model="showEditForm" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser">
            <FormItem label="状态" prop="status">
              <RadioGroup v-model="showEditForm.status">
                <Radio :label="0" >待审核</Radio>
                <Radio :label="1" >已审核</Radio>
                <Radio :label="2" >待审定</Radio>
              </RadioGroup>
        </FormItem>
      </Form>
     </Modal>

    <Modal v-model="showEditModal"
           @on-ok="saveEdit"
           @on-cancel="cancelEdit">
      <h3 slot="header" style="color:#2D8CF0">修改信息</h3>
      <Form :model="showEditForm" label-position="right" :label-width="100" @submit.native.prevent="saveEditUser">
        <FormItem  label="投诉客户" prop="wangwangnum" >
          <Input v-model="showEditForm.wangwangnum"/>
        </FormItem>
        <FormItem label="投诉渠道" prop="channel">
          <select v-model="showEditForm.channel" style="width: 380px;height:35px">
                <option value="1">招商京东</option>
                <option value="2">招商淘宝</option>
                <option value="3">综管部</option>
                <option value="4">企划部</option>
                <option value="5">京东官方投诉</option>
                <option value="6">京东差评投诉</option>
                <option value="7">淘宝官方投诉</option>
                <option value="8">其他</Option>
            </select>
        </FormItem>
        <FormItem label="场景还原" prop="scenerestoration">
          <Upload
                ref="upload" name="file"
                action="http://localhost:8090/sys/complaint/upload"
                :on-success="handleSuccess"
                :on-format-error="handleFormatError">
              <i-button type="primary" icon="ios-cloud-upload-outline">上传文件</i-button>
          </Upload>
       </FormItem>
        <FormItem label="客诉大类别" prop="levelName">
          <Select @on-change="selectLevel" v-model="showEditForm.level" placeholder="Select your level">
            <Option v-for="levelId in levels" :label="levelId.levelName" :value="levelId.level" :key="levelId.level">
              {{levelId.levelName}}
            </Option>
          </Select>
        </FormItem>

        <FormItem label="客诉小类别" prop="complaintName">
          <Select v-model="showEditForm.complaintIds" placeholder="Select your pkId">
            <Option v-for="complaintNameId in levelNames" :label="complaintNameId.complaintName"
                    :value="complaintNameId.complaintIds" :key="complaintNameId.complaintIds">
              {{complaintNameId.complaintName}}
            </Option>
          </Select>
        </FormItem>

        <FormItem label="判责结果" prop="result">
          <RadioGroup v-model="showEditForm.result">
            <Radio :label="0" >无责</Radio>
            <Radio :label="1" >有责</Radio>
            <Radio :label="2" >待定</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="责任轻重" prop="responsibility">
          <RadioGroup v-model="showEditForm.responsibility">
            <Radio :label="0" >微责</Radio>
            <Radio :label="1" >轻责</Radio>
            <Radio :label="2" >中责</Radio>
            <Radio :label="3" >重责</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否删除" prop="content">
          <Input v-model="showEditForm.content"/>
        </FormItem>
        <FormItem label="责任人id" prop="complaintid">
          <Input v-model="showEditForm.complaintid"/>
        </FormItem>
        
        <!-- <FormItem label="投诉日期" prop="complaintdate">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="showEditForm.complaintdate" placeholder="Select date and time(Excluding seconds)" style="width: 300px"></DatePicker>
        </FormItem> -->
      </Form>
    </Modal>

    <Modal v-model="showDeleteModal"
           width=15
           @on-ok="saveDelete"
           @on-cancel="cancelDelete">
      <!--<h3 slot="header" style="color:red">确定删除吗</h3>-->
      <h2 style="color:red;text-align: center;font-size: 20px" >确定删除吗</h2>

    </Modal>
  </div>
</template>

<script>
  import API from "../../api";
    export default {
        name: "Complaint",
      data(){
        return{
          params: {
            pageNum: 1,
            pagesize: 10,
            keyword: '',
            status:-1
          },
          params1:{
            level:0,
          },
          showEditModal: false,
          reViewModal:false,
          showAddModal: false,
          totalCount: 0,
          tscustomer:[],
          pageNumber:[],//表格页数
          length:[], //表格每页长度
          size:[],//批量删除时候选中的个数
          showModal:false,
          showAddForm:{
            wangwangnum: '',
            complaintdate: '',
            channel: '',
            content:'',
            scenerestoration:'',
            remarks:'',
          },
          showEditForm:{
            pkId: '',
            wangwangnum: '',
            complaintdate: '',
            channel: '',
            scenerestoration: '',
            remarks: '',
            frequency: '',
            level: '',
            result: '',
            personnelid: '',
            responsibility: '',
            content: '',
            shopptype: '',
            teamname: '',
            department: '',
            isStop: '',
            custtype: '',
            worktype: '',
            status: '',
            tscustomer: '',
            parentId: '',
            complaintName: '',
            sonId: '',
            isDelete: '',
            createTime: '',
            complaintid: '',
            personnelid: '',
            technologyRecruitmentID: '',
            levelName:'',
            complaintIds: '',
         },
          //表单验证(如果为空就会提示)
      addForm:{
        wangwangnum: [
            {required: true, message: '请输入投诉客户', trigger: 'blur'}
          ],
        channel: [
            {required: true, message: '请选择投诉渠道', trigger: 'blur'}
          ],
        content: [
            {required: true, message: '请输入投诉内容', trigger: 'blur'}
          ]
      },
          loading:false,
          showDeleteModal:false,
          columns1:[
            {
              type: 'selection',
              width: 60,
              align: 'center',
              fixed: 'left'
            },
            {
              title: '客户名',
              width:100,
              align: 'center',
              key: 'wangwangnum'
            },
            {
              title: '店长',
              width:100,
              align: 'center',
              key: 'username'
            },
            {
              title: '状态',
              width: 100,
              key: 'status',
              render: (h, params) => {
                const row = params.row;
                const color=row.status==0 ? 'green' :(row.status ==1 ? 'red':'blue');
                const text=row.status==0 ? '待审核' :(row.status ==1 ? "已审核":"待审定");

                return h('Tag', {
                  props: {
                    color: color
                  }
                }, text);
              },
              align: 'center'
            },
             {
              title: '客诉内容',
              width:350,
              align: 'center',
              key: 'content'
            },
             {
              title: '投诉日期',
              width:150,
              align: 'center',
              key: 'complaintdate'
            },
            {
              title: '操作',
              key: 'action',
              align: 'center',
              render: (h, params) => {
                let editBtn = h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => {
                      this.showEditModalData(params);
                    }
                  }
                }, '修改');
                let reViewBtn = h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: ()=>{
                      this.reViewEditModalData(params);
                    }
                  }
                }, '审核');
                let deleteBtn = h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: ()=>{
                      this.delete(params);
                    }
                  }
                }, '删除');
                let showBtn = h('Button', {
                  props: {
                    type: 'success',
                    size: 'small'

                  },
                  on: {
                    click: () =>{
                      this.lookModal(params);
                    }
                  }

                }, '历史记录');
                return h(
                  'div', [editBtn, deleteBtn, showBtn]
                );
              }
            }
          ],
          columns2:[

            {
              title: '客户',
              width:150,
              align: 'center',
              key: 'wangwangnum'
            },


            {
              title: '投诉内容',
              align: 'center',
              key: 'content'
            },

            {
              title: '投诉次数(第几次)',
              align: 'center',
              key: 'frequency'
            },
            {
              title: '审核状态',
              align: 'center',
              key: 'status',
              render: (h, params) => {
                const row = params.row;
                const color=row.status==0 ? 'green' :(row.status ==1 ? 'red':'blue');
                const text=row.status==0 ? '待审核' :(row.status ==1 ? "已审核":"待审定");

                return h('Tag', {
                  props: {
                    color: color
                  }
                }, text);
              },
            },

          ],
          isClearAble: true,
          isDisabled: true,
          loadingStatus:false,
          levels:[],
          levelNames:[],
          data1:[],
          data2:[],
          pkIds:[]
        }
      },
      //生命周期
      mounted()
      {
        // 初始化
        this.init();
       this.second();
      },
      created:function(){

      },
      methods:{
        handleSelectAll (status) {
          this.$refs.selection.selectAll(status);
        },
        searchComplaint(){
          // 数据初始化
          this.loading = true;
          this.params.pageNum=1;
          API.complaintList.lists(this.params).then(({data}) => {
            if (data && data.code == 0) {
              this.data1 = data.data.list;
              this.totalCount = data.data.total;
              this.length=data.data.list.length
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          });
          this.loading = false;
        },
        init() {
          // 数据初始化
          this.loading = true;
          API.complaintList.lists(this.params).then(({data}) => {
            if (data && data.code == 0) {
              this.data1 = data.data.list;
              // console.log("第一个data1为:"+this.data1);
              this.totalCount = data.data.total;
              this.length=data.data.list.length;
              for(var i = 0;i<this.length;i++){
                this.tscustomer.push(data.data.list[i].tscustomer);
                // this.second(data.data.list[i].tscustomer);
              }
              // console.log("车手id为:"+this.tscustomer);
               //二次调用
              
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          });
          this.loading = false;
        },
        second:function(){
          // this.loading = true;
          // console.log(Id);
          // var userId = Id;
          //let id = {id:userId};
          // console.log(userId);
          console.log("=====================");
          console.log(this.tscustomer.length);
          var Id = 0;
          for(var i = 0;i<this.tscustomer.length;i++){
                Id = this.tscustomer[i];
                // console.log("Id为"+Id);
                console.log("22222222222222222222");
                // debugger
              }
              var userId = Id;
          console.log(Number(userId));
          console.log("5555555555555555555555");
          var params = {id:Number(userId)};
               API.complaintList.listById(params).then(({data}) => {
              console.log("打印状态吗"+data.code);
            if (data && data.code == 0) {
              this.data1 = data.data;
              console.log(this.data1+"data1为");
              this.totalCount = data.data.total;
              this.length=data.data.list.length;
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          });
          this.loading = false;
        },
        
        //获取大类id
          selectLevel(){
          console.log("获取大类呀!");
          // console.log(this.showEditForm.level);
          this.params1.parentId=this.showEditForm.level;
          //  console.log("this.params1.cityId="+this.params1.parentId);
          // console.log("7777777777777777777777777");
         //小类
          API.complaintList.getLevelName(this.params1).then(({data}) => {
            if (data && data.code == 0) {
              this.levelNames = data.data.list;
              console.log(this.levelNames)
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          });

         
        },
        pageChange(num) {
          this.params.pageNum = num;
          this.pageNumber=num;
          this.init();
        },
        sizeChange(size) {
          this.params.pagesize = size;
          this.init();
        },
        resetData(val){
          if (!val){
            this.showAddForm = {
              wangwangnum: '',
              channel: '',
              content: ''
            };

          }
        },
        addModal(){
          this.showAddModal=true;
        },
        //上传
         //上传成功之后的方法
    handleSuccess(res,file){
    if (res.code == 0) {
      alert("上传中");
        let scenerestoration = file.response.data;
        console.log("上传哦!老哥");
        this.showEditForm.scenerestoration = scenerestoration;
        console.log(this.scenerestoration);
    } else {
        alert("上传失败");
    }
    },
    //上传错误回调
    handleFormatError (file) {
    this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
    });
},
        save(){
          API.complaintList.insert(this.showAddForm).then(({data}) => {
            if (data && data.code == 0) {
              this.init();
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          })
        },
        cancel(){
          this.showAddModal=false;

        },
        showEditModalData(params){
          this.showEditModal=true;
          //大类
          API.complaintList.selectLevel(this.params).then(({data}) => {
            if (data && data.code == 0) {
              this.levels = data.data;
              // console.log("大类");
              // console.log(this.levels);
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          });

          if (typeof params.row != 'undefined') {
            const Complaint = params.row;
            console.log(Complaint.compalintid+"责任人id为");
            console.log(Complaint.complaintdate+"时间为");
            this.showEditForm.pkId = Complaint.pkId;
            this.showEditForm.wangwangnum=Complaint.wangwangnum;
            this.showEditForm.channel = Complaint.channel;
            this.showEditForm.scenerestoration = Complaint.scenerestoration;
            this.showEditForm.shopptype = Complaint.shopptype;
            this.showEditForm.remarks = Complaint.remarks;
            this.showEditForm.responsibility = Complaint.responsibility;
            this.showEditForm.frequency = Complaint.frequency;
            this.showEditForm.level = Complaint.level;
            this.showEditForm.result = Complaint.result;
            this.showEditForm.personnelid = Complaint.personnelid;
            this.showEditForm.content = Complaint.content;
            this.showEditForm.shopptype = Complaint.shopptype;
            this.showEditForm.teamname = Complaint.teamname;
            this.showEditForm.department = Complaint.department;
            this.showEditForm.custtype = Complaint.custtype;
            this.showEditForm.worktype = Complaint.worktype;
            this.showEditForm.personnelid=Complaint.personnelid;
            this.showEditForm.tscustomer = Complaint.tscustomer;
            this.showEditForm.parentId = Complaint.parentId;
            this.showEditForm.complaintName = Complaint.complaintName;
            this.showEditForm.complaintid = Complaint.complaintid;
            this.showEditForm.sonId = Complaint.sonId;
            this.showEditForm.technologyRecruitmentID = Complaint.technologyRecruitmentID;
            this.showEditForm.status = Complaint.status;
            this.showEditForm.complaintdate = Complaint.complaintdate;
          }
        },
        reViewEditModalData(params){
          this.reViewModal = true;
           if (typeof params.row != 'undefined') {
            const Complaint = params.row;
            this.showEditForm.pkId = Complaint.pkId;
            this.showEditForm.status = Complaint.status;
          }
        },

        /* 删除模块，弹出弹框*/
        delete(params) {
          //this.pkIds=[params.row.pkId];
          this.pkIds=[ ];
          this.showDeleteModal=true;
          let pkIds=this.pkIds;
          if (typeof params.row != 'undefined') {
            pkIds.push(params.row.pkId);
          }else {
            this.selection.forEach( v => {
              pkIds.push(v.pkId)
            });
          };
        },
        /* 确定删除*/
        saveDelete(){
          let pkIds=this.pkIds;
          let param = {
            "pkIds": pkIds
          };
          API.complaintList.less(param).then(({data}) => {
            if (data && data.code == 0) {
               if(this.params.pageNum > 1){
            if (this.length==1 || this.size==this.length) {
                this.pageNumber=this.pageNumber-1;
                this.params.pageNum = this.pageNumber;
            }
            }
              this.init();
            } else {
              this.$Message.error(data.msg);
            };
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          });

        },
        /*取消*/
        cancelDelete(){
          this.showDeleteModal=false;
        },
        // 选择状态改变
        selectionChange(data) {
          this.size=data.length
          this.selection = data;
        },
        saveEdit(){
          API.complaintList.update(this.showEditForm).then(({data}) => {
            if (data && data.code == 0) {
              this.init();
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          })
        },
        cancelEdit(){
          this.showEditModal = false;
        },
        lookModal(params){
         
          this.showModal=true;
           this.params.wangwangnum = params.row.wangwangnum;
           this.params.pageNum=1;
          // 数据初始化
          this.loading = true;
          /*data是接口返回的data*/
          API.complaintList.listByWangWangNum(this.params).then(({data}) => {
            if (data && data.code == 0) {
              this.data2 = data.data;
              console.log(this.data2+"data2为");
              console.log("旺旺号为:"+this.params.wangwangnum);
              this.params.wangwangnum='';
            } else {
              this.$Message.error(data.msg);
            }
          }).catch((data) => {
            this.$Message.error('连接失败，请检查网络！');
          });
          this.loading = false;
        },
        saveTable(){this.showModal=false;},
        cancelTable(){this.showModal=false;}

      }
    }
</script>

<style scoped>

</style>
