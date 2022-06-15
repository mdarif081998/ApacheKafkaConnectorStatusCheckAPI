const request = require('request')

let connectors;
const allStatus = [];
const requiredInfo =[];

const connectorsList = () => {
    connectors = [];
    return new Promise((resolve, reject, err) => {
        if(err){
            reject(err);
        }
        const url = 'http://localhost:8083/connectors';
        request({ url, json: true }, (error, {body} ) => {
            if (error) {
                reject(error)
            }
            connectors = body;
             resolve(body)
        })

    })
}

const connectorNameandNo = () => {
    connectors = [];
    return new Promise((resolve, reject, err) => {
        if(err){
            reject(err);
        }
        const url = 'http://localhost:8083/connectors';
        request({ url, json: true }, (error, {body} ) => {
            if (error) {
                reject(error)
            }
            connectors = body;
            const conNameNum = [];
            let serialNo =1;
            connectors.forEach((connector) => {
                const con = {
                    serialNumber: serialNo,
                    connectorName: connector
                }
                conNameNum.push(con);
                serialNo++;

            })
             resolve(conNameNum)
        })

    })
}



const allConnectorsStatusDetails = () => {
    allStatus.length=0;
    return new Promise((resolve, reject, err) => {
        if(err){
            reject(err);
        }

        connectorsList().then( ()=>{
            connectors.forEach( async(connector) => {
                const consta = await request1(connector);
                const cond = await request2(connector);

               console.log(consta);
                console.log(cond);

                if(cond.type == 'sink'){
                    const condet = {
                        connectorName: consta.name,
                        connectorState: consta.connector.state,
                        connectorWorkerId: consta.connector.worker_id,
                        connectorTaskId: consta.tasks[0].id,
                        connectorTaskState: consta.tasks[0].state,
                        connectorTaskWorkerId: consta.tasks[0].worker_id,
                        connectorType: consta.type,
                        conTopic: cond.config.topics
                    } 
                    allStatus.push(condet);
                }else{
                    const condet = {
                        connectorName: consta.name,
                        connectorState: consta.connector.state,
                        connectorWorkerId: consta.connector.worker_id,
                        connectorTaskId: consta.tasks[0].id,
                        connectorTaskState: consta.tasks[0].state,
                        connectorTaskWorkerId: consta.tasks[0].worker_id,
                        connectorType: consta.type,
                        conTopic: cond.config.topic
                    } 
                    allStatus.push(condet);
                }
                   
                       
                       
                        
                       if(connectors.length == allStatus.length){
                        //console.log(allStatus);
                        resolve(allStatus);
                    }

                        })
                         
                    })

                    
                   
                })
    
}


const request1 = (contr) => {
    return new Promise((resolve, reject, error)=> {
        if(error){
            reject(error);
        }
        let url = 'http://localhost:8083/connectors/'+contr+'/status';
                
                let constts;
                request({ url, json: true }, (error, {body} ) => {
                    if (error) {
                        reject(error)
                    }
                    constts = body;
                   // console.log(constts);
                    resolve(constts);

    })
})
}

const request2 = (contr) => {
    return new Promise((resolve, reject, error)=> {
        if(error){
            reject(error);
        }
        let url = 'http://localhost:8083/connectors/'+contr;
                
                let contopic;
                request({ url, json: true }, (error, {body} ) => {
                    if (error) {
                        reject(error)
                    }
                    contopic = body;
                   // console.log(contopic);
                    resolve(contopic);

    })
})
}

const status = () => {
    requiredInfo.length=0;
    return new Promise((resolve, reject, err) => {
        if(err){
            reject(err);
        }

        connectorsList().then(()=>{
            connectors.forEach(connector => {
                const url = 'http://localhost:8083/connectors/'+connector+'/status';
                request({ url, json: true }, (error, {body} ) => {
                    if (error) {
                        reject(error)
                    }
                    const tasksStatus=[];
                    const tasks=body.tasks;
                    tasks.forEach(task=>{
                        tasksStatus.push(task.state)
                    })
                    const record={
                        connectorName: body.name,
                        connectorState: body.connector.state,
                        tasksState: tasksStatus
                    }
                    requiredInfo.push(record);
                    //console.log(record)


                    if(connectors.length == requiredInfo.length){
                        resolve(requiredInfo);
                    }
                })
        })
   })       
})

}

module.exports = {
    connectorsList: connectorsList,
    connectorNameandNo: connectorNameandNo,
    allConnectorsStatusDetails: allConnectorsStatusDetails,
    status: status
}
