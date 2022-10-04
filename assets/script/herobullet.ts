
import * as cc from 'cc';
import { _decorator, Component, Node, CCObject, Vec3, tween, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('herobullet')
export class herobullet extends Component {

    _ismove:Boolean = false;    //是否移动
    _speed:number = 0;          //移动速度
    _limit_W:number             //屏幕限制w
    _limit_h:number             //屏幕限制h

    start() {
        
        let gameSize = cc.view.getDesignResolutionSize()
        let node_w = this.getComponent(cc.UITransformComponent).contentSize.width
        let node_h = this.getComponent(cc.UITransformComponent).contentSize.height
        this._limit_W = gameSize.width/2 + node_w
        this._limit_h = gameSize.height/2 + node_h

         // 注册单个碰撞体的回调函数
         let collider = this.getComponent(Collider2D);
         if (collider) {
             collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
         }

        //   // 注册全局碰撞回调函数
        //   if (PhysicsSystem2D.instance) {
        //     PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        //     console.log('yyyyyyyy')
        //     //PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        // }
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        console.log('onBeginContact');
        console.log('aaaa = ', selfCollider.tag);
        console.log('bbbb = ', otherCollider.tag);
    }

    //初始化子弹
    initBullet(name:string, spos:Vec3, speed:number)
    {
        //设置子弹名字
        let label = this.node.getComponent(cc.Label);
        label.string = name;

        //设置初始位置
        this.node.setPosition(spos);

        //设置大小
        this.node.setScale(0,0);

        this._speed = speed;

        this. setStartMove()
    }

    //开始移动
    setStartMove()
    {
        tween()
        .target(this.node)
        .to(2.0, { scale: new Vec3(1, 1, 0) })
        .start()
        this._ismove = true;
    }

    update(deltaTime: number) {

        if(this._ismove)
        {
            const oldPos = this.node.getPosition()
            //超出屏幕，不移动，销毁自己
            if(oldPos.x < -this._limit_W || oldPos.x > this._limit_W)
            {
                this._ismove = false
                this.node.destroy();
                return
            }
            else if(oldPos.y < -this._limit_h || oldPos.y > this._limit_h)
            {
               // console.log('子弹销毁自己')
                this._ismove = false
                this.node.destroy();
                return
            }

            //移动
            const newPos = oldPos.add(
                cc.v3(0,this._speed, 0)
                //this._moveDir.clone().multiplyScalar(this._speed / 60)
            )
            this.node.setPosition(newPos)
        }
        
    }
}

