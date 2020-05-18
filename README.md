# AdminSystem

#### PubChannel

```typescript
const PubChannel = "AdminSystem-Channel";
```

#### 資料異動通知 - Update

```typescript
const message = {
  messageType: this.rediskey.AdminSystemPubChannel,
  serverId: id,
  serverToken: api.config.general.serverToken,
  agentInfo: {
    parentId: number,
    account: string,
    name: string,
    prefix: string,
    isMaintained: boolean,
    lastLoginIP: string,
    isEnabled: boolean,
    lastLoginDatetime: Date,
    createDatetime: Date,
    website: string,
    hashKey: string,
    APIDomain: string,
    whiteIPList: string,
  },
};
```
