import {RedisClientType, createClient} from 'redis';



export class PubSubManager{
    private static instance : PubSubManager; 
    private redisClient : RedisClientType;
    //Map<APPL,userIds[]> => userIds for all who subscribed for the APPL stock
    private subscriptions : Map<string,string[]>;
    private constructor(){
        this.redisClient=createClient();
        this.redisClient.connect();
        this.subscriptions=new Map();
    }
    static getInstance(){
        if(PubSubManager.instance){
            PubSubManager.instance;
        }
        PubSubManager.instance=new PubSubManager();
        return PubSubManager.instance;
    }

    addUserToStock(userId:string,stock:string){
        //this line checks whether the subsricption map has already contains an entry for that stock or not
        if(!this.subscriptions.has(stock)){
            this.subscriptions.set(stock,[]);
        }
        //! .get(stock): The get method of the Map object, which returns the value associated with the given key (in this case, the stock ticker). If the key does not exist in the map, it returns undefined
        //! ?.: The optional chaining operator ensures that the push method is only called if the result of this.subscriptions.get(stock) is not undefined. If it is undefined (i.e., the stock key does not exist in the map), the operation is safely skipped without causing an error.
        this.subscriptions.get(stock)?.push(userId);
        if(this.subscriptions.get(stock)?.length===1){
            this.redisClient.subscribe(stock,(message)=>{
                this.forwardMessageToUser(stock,message);
            })
            console.log(`UserID with ${userId} has subscribed to Redis channel: ${stock}`);
        }
    }
    removeUserFromStock(userId:string,stock:string){
        this.subscriptions.set(stock, this.subscriptions.get(stock)?.filter((sub) => sub !== userId) || []);
        if(this.subscriptions.get(stock)?.length===0){
            this.redisClient.unsubscribe(stock);
            console.log(`UnSubscribed to Redis channel: ${stock}`);
        }
    }
    forwardMessageToUser(stock:string,message:string){
        console.log(`Message received on channel ${stock}: ${message}`);
        this.subscriptions.get(stock)?.forEach((sub)=>{
            console.log(`Sending message to user: ${sub}`);
        })
    }

    public async disconnect() {
        await this.redisClient.quit();
    }    
}

PubSubManager.getInstance();