#fascom-recognition

## websocket注册

### 信息参数

```json
{
    type: 'register',
    data:{
        from: 'big'/'small'
    }
}
```

## 发送拍照以及识别请求

### 信息参数

```json
{
    type: 'recognize'
}
```

## 发送训练请求

### 信息参数
```json
{
    type: 'training',
    data: {
        token:
        address: 
        continent:
        signature: 
    }
}
```

## 发送提交题词请求

### 信息参数

```json
{
    type: 'inscription',
    data: {
        id:
        inscription: 
    }
}
```

## 发送更新签名请求

### 信息参数

```json
{
    type: 'signature',
    data: {
        id:
        signature: 
    }
}
```



## 识别失败

### 返回数据格式

```json
{
    "type": "recognize",
    "successful": false,
    "data": {
        "token": "dserew45rf2543632652",
        "image":"/recognize/6858f213-dd7d-42c7-b91f-b347ff932a0e.jpg"
    }
}
```

## 错误

### 返回数据格式

```json
{
    "type": "error",
    "successful": false,
    "error": {
        id: 
        message: 
    }
}
```

## 返回时间轴

### 返回数据格式

```json
    {
        "type": "timeline",
        "successful": true,
        "data": {
            "token": 0,
            "detectedPerson": {
                "Id": 1,
                "name": null,
                "address": "",
                "mid": "20",
                "signature": "/signature/729bddf7-f3fa-48cc-987a-a112087ec92d.jpg",
                "city": "合肥",
                "continent": "亚洲",
                "imagePath": "/recognize/f815149c-bddd-4755-98e0-1a12dc466e60.jpg",
                "qrcode": "/qrcode/1.jpg",
                "visitTimes": 5,
                "visitRecords": [
                    {
                        "Id": 6,
                        "isInscription": 1,
                        "Time": "2017-02-28T12:27:53.000Z",
                        "imagePath": "/inscription/65bef090-006a-4b83-b5cd-eaae5d40edfa.jpg",
                        "Person": 1
                    },
                    {
                        "Id": 5,
                        "isInscription": 0,
                        "Time": "2017-02-28T11:22:48.000Z",
                        "imagePath": "/recognize/ea5fa3ba-0f6e-42e1-aacd-502d7bb75bb9.jpg",
                        "Person": 1
                    }
                ]
            }
        }
    }
```

## 小屏幕提交题词
* POST

#### URL
* /face_recognition/inscription

#### 参数
    {
        id：
        inscription: 题词 
    }

### 返回数据格式
```json
    res.json({
        successful: true
    });
```

## 小屏幕获取时间轴
* GET

#### URL
* /face_recognition/timeline

#### 参数
    {
        id： 
    }

### 返回数据格式
```json
    {
        "successful": true,
        "data": {
            "token": 0,
            "detectedPerson": {
                "Id": 1,
                "name": null,
                "address": "",
                "mid": "20",
                "signature": "/signature/729bddf7-f3fa-48cc-987a-a112087ec92d.jpg",
                "city": "合肥",
                "continent": "亚洲",
                "imagePath": "/recognize/f815149c-bddd-4755-98e0-1a12dc466e60.jpg",
                "qrcode": "/qrcode/1.jpg",
                "visitTimes": 5,
                "visitRecords": [
                    {
                        "Id": 6,
                        "isInscription": 1,
                        "Time": "2017-02-28T12:27:53.000Z",
                        "imagePath": "/inscription/65bef090-006a-4b83-b5cd-eaae5d40edfa.jpg",
                        "Person": 1
                    },
                    {
                        "Id": 5,
                        "isInscription": 0,
                        "Time": "2017-02-28T11:22:48.000Z",
                        "imagePath": "/recognize/ea5fa3ba-0f6e-42e1-aacd-502d7bb75bb9.jpg",
                        "Person": 1
                    },
                    {
                        "Id": 4,
                        "isInscription": 0,
                        "Time": "2017-02-28T11:21:06.000Z",
                        "imagePath": "/recognize/783be79e-609a-411e-829b-498f72ce148c.jpg",
                        "Person": 1
                    },
                    {
                        "Id": 3,
                        "isInscription": 0,
                        "Time": "2017-02-28T11:14:44.000Z",
                        "imagePath": "/recognize/6f2bfbe7-97b5-49fa-bcf0-09e3e44f732c.jpg",
                        "Person": 1
                    },
                    {
                        "Id": 2,
                        "isInscription": 0,
                        "Time": "2017-02-28T11:13:41.000Z",
                        "imagePath": "/recognize/d28164d0-953b-412a-b58c-73999ec3267f.jpg",
                        "Person": 1
                    },
                    {
                        "Id": 1,
                        "isInscription": 0,
                        "Time": "2017-02-28T11:10:15.000Z",
                        "imagePath": "/recognize/f815149c-bddd-4755-98e0-1a12dc466e60.jpg",
                        "Person": 1
                    }
                ]
            }
        }
    }
```

## 小屏幕发送抓拍请求
* POST

#### URL
* /face_recognition/call_snap

#### 参数
无

### 返回数据格式
    {
        successful: true
    }

## 大屏幕定时接收抓拍请求
* GET

#### URL
* /face_recognition/is_snap

#### 参数
无

### 返回数据格式
    {
        successful: true,
        data: {
            isSnapping: true/false
        }
    }


## 小屏幕定时接受是否需要训练的请求
* GET

#### URL
* face_recognition/is_tarining

#### 参数
无
### 返回数据格式
    {
        successful: hasResult true/false,
        data: {
            id: ,
            isTraining: shouldtrain true/false ,
            token: ,
            path: "/recognize/def17347-798c-4238-aa80-fe5bba808529.jpg"
        }
    }

## 照片墙照片显示
* GET

#### URL
* /home/photowall

#### 参数
无

### 返回数据格式

    {
        "successful": true,
        "data": {
            "files": [
                [
                    "/FTP_Files/AllFile/1.jpg"
                    ...
                ],
                [
                    "/FTP_Files/AllFile/1.jpg"
                    ...
                ],
                [
                    "/FTP_Files/AllFile/1.jpg",
                    ...
                ]
                ....
            ]
        }
    }

##人脸识别

#### 接口请求方式
* POST

#### URL
*  /face_recognition/recognition

#### 参数
无

### 返回数据格式
    {
        "successful": true,
        "data": {
            "token": "2dbd3614-865b-433b-abd7-6d9fc1a7c203",
            "detectedPerson": {
                "Id": 1,
                "name": "某某某",
                "address": "hfut",
                "signature": "/recognize/def17347-798c-4238-aa80-fe5bba808529.jpg",
                "city": "合肥",
                "continent": "亚洲",
                "imagePath": "/recognize/5bd0490c-672b-4763-ac8d-106327ec5b70.jpg",
                "visitRecords": [
                    {
                        "Id": 1,
                        "Time": "2016-12-23T06:37:56.000Z",
                        "imagePath": "/recognize/b9863b17-a05e-461b-905a-ea21388216a0.jpg",
                        "Person": 1
                    },
                    {
                        "Id": 2,
                        "Time": "2016-12-23T06:41:43.000Z",
                        "imagePath": "/recognize/fc7e21d0-a3d3-4b04-81eb-ae1d9aa0987f.jpg",
                        "Person": 1
                    },
                    {
                        "Id": 3,
                        "Time": "2016-12-23T06:45:27.000Z",
                        "imagePath": "/recognize/2c611622-4ba2-4257-b176-8864c7ecc25e.jpg",
                        "Person": 1
                    },
                    {
                        "Id": 4,
                        "Time": "2016-12-23T06:48:55.000Z",
                        "imagePath": "/recognize/6e8dc9d2-eda6-4aa6-bf27-7c538218999c.jpg",
                        "Person": 1
                    },
                    {
                        "Id": 5,
                        "Time": "2016-12-23T06:53:41.000Z",
                        "imagePath": "/recognize/6858f213-dd7d-42c7-b91f-b347ff932a0e.jpg",
                        "Person": 1
                    }
                ]
            }
        }
    }
    识别失败
     {
        "successful": false,
        "data": {
            "token": "2dbd3614-865b-433b-abd7-6d9fc1a7c203",
            "image":"/recognize/6858f213-dd7d-42c7-b91f-b347ff932a0e.jpg"
        }
    }


##未识别出需要提交信息进行训练

#### 接口请求方式
* POST

#### URL
*  /face_recognition/training

#### 参数
    {
        token:
        address: 
        continent:
        signature: 
    }

###返回数据格式
    {
        successful: true
    }


##搜索

#### 接口请求方式
* POST

#### URL
*  /home/search

#### 参数
{
    name: '某某某',
    city: '北京',
    continent: '亚洲'
}
可以任选一个

###返回数据格式
    {
        "successful": true,
        "persons": [
            {
                "Id": 1,
                "name": "sdafsad",
                "address": "asdfs",
                "signature": "/recognize/def17347-798c-4238-aa80-fe5bba808529.jpg",
                "city": "合肥",
                "continent": "亚洲",
                "imagePath": "/recognize/5bd0490c-672b-4763-ac8d-106327ec5b70.jpg"
            }
        ]
    }

##返回所有洲的人数

#### 接口请求方式
* GET

#### URL
*  /home/count/continent

#### 参数
无

###返回数据格式
    {
        "successful": true,
        "data": {
            "continents": [
                0,
                0,
                0,
                1,
                22,
                0
            ]
        }
    }
其中顺序为['北美洲', '南美洲', '非洲', '欧洲', '亚洲', '大洋洲']

##返回所有城市的人数

#### 接口请求方式
* GET

#### URL
*  /home/count/city

#### 参数
无

###返回数据格式
    {
        "successful": true,
        "data": {
            "cities": [
                0,
                7,
                6,
                7,
                1,
                0,
                0,
                0,
                0
            ]
        }
    }
其中顺序为['北京', '南京', '合肥', '上海', '广州', '杭州', '西安', '成都', '苏州']
