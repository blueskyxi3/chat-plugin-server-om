import { Button, Input, Table, App } from 'antd';
import { useState } from 'react';
import { Center } from 'react-layout-kit';
import { lobeChat  } from '@lobehub/chat-plugin-sdk/client';


const QueryServers = ({
    loading,
    filterIp,
    setFilterIp,
    servers,
    selectedRowKeys,
    setSelectedRowKeys,
    handleQueryServers,
}: any) => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const { message } = App.useApp();

    const handleConfirm =async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('请确认服务器');
            return;
        }
        message.success(`已选择服务器: ${selectedRowKeys.join(', ')}`);
        lobeChat.setPluginMessage({ "IPs": selectedRowKeys });
        lobeChat.getPluginMessage().then((msg: any)=>{
         lobeChat.triggerAIMessage(msg);
        }); 
        // lobeChat.createAssistantMessage('已确认服务器');

        setIsConfirmed(true);
    };

    return (
        <Center style={{ height: 250, overflow: 'hidden', position: 'relative', width: '100%',  }}>
            <div style={{ width: '100%' }}>
                <div style={{  display: 'flex',  gap: 8, marginBottom: 16,}}>
                    <Input
                        onChange={(e) => setFilterIp(e.target.value)}
                        placeholder="根据IP过滤"
                        style={{ width: 200 }}
                        value={filterIp}
                    />
                    <Button
                        disabled={isConfirmed} // 确认后禁用查询按钮
                        loading={loading}
                        onClick={handleQueryServers}
                        type="primary"
                    >
                        查询
                    </Button>
                    <Button
                        disabled={isConfirmed || selectedRowKeys.length === 0} 
                        onClick={handleConfirm}
                        type="default"
                    >
                        确认
                    </Button>

                </div>
                <Table
                    columns={[
                        { dataIndex: 'ip',key: 'ip',title: 'IP地址', },
                        { dataIndex: 'status', key: 'status', title: '状态', },
                    ]}
                    dataSource={servers.filter((s: any) => !filterIp || s.ip.includes(filterIp))}
                    pagination={false}
                    rowKey="ip"
                    rowSelection={{
                        onChange: setSelectedRowKeys,
                        selectedRowKeys,
                        type: 'checkbox',
                    }}
                    size="small"
                />
            </div>
        </Center>
    );
};

export default QueryServers;