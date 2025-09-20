import { Button, Input, Table, message } from 'antd';
import { useState } from 'react';
import { Center } from 'react-layout-kit';
import { lobeChat } from '@lobehub/chat-plugin-sdk/client';

const QueryServers = ({
    loading,
    filterIp,
    setFilterIp,
    servers,
    setServers,
    selectedRowKeys,
    setSelectedRowKeys,
    handleQueryServers,
}: any) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    const handleConfirm = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('请确认服务器');
            return;
        }
        message.success(`已选择服务器: ${selectedRowKeys.join(', ')}`);
        lobeChat.getPluginMessage().then(content => console.log('当前消息内容-------->', content));
        lobeChat.setPluginMessage({ "IPs": selectedRowKeys });
        lobeChat.triggerAIMessage('qw001xxx1');
        //lobeChat.createAssistantMessage('已确认服务器');

        setIsConfirmed(true);
    };

    return (
        <Center style={{ height: 250, position: 'relative', width: '100%', overflow: 'hidden' }}>
            <div style={{ width: '100%' }}>
                <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
                    <Input
                        placeholder="根据IP过滤"
                        value={filterIp}
                        onChange={(e) => setFilterIp(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={handleQueryServers}
                        disabled={isConfirmed} // 确认后禁用查询按钮
                    >
                        查询
                    </Button>
                    <Button
                        type="default"
                        onClick={handleConfirm}
                        disabled={isConfirmed || selectedRowKeys.length === 0} // 确认后或没有选中项时禁用确认按钮
                    >
                        确认
                    </Button>

                </div>
                <Table
                    dataSource={servers.filter((s: any) => !filterIp || s.ip.includes(filterIp))}
                    columns={[
                        { title: 'IP地址', dataIndex: 'ip', key: 'ip' },
                        { title: '状态', dataIndex: 'status', key: 'status' },
                    ]}
                    rowKey="ip"
                    pagination={false}
                    size="small"
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                        type: 'checkbox',
                    }}
                />
            </div>
        </Center>
    );
};

export default QueryServers;