import '@ant-design/v5-patch-for-react-19';
import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import { Button, Input, Table, message, Card, List } from 'antd';
import { memo, useEffect, useState } from 'react';
import { Center } from 'react-layout-kit';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const Render = memo(() => {
    const [data, setData] = useState<any>();
    const [payload, setPayload] = useState<any>();
    const [loading, setLoading] = useState(false);
    const [filterIp, setFilterIp] = useState('');
    const [servers, setServers] = useState<any[]>([]);
    const [result, setResult] = useState<string | null>(null);

    // executeShell编辑相关
    const [command, setCommand] = useState('');
    const [ipList, setIpList] = useState<string[]>([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const handleConfirm = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('请确认服务器');
            return;
        }
        message.success(`已选择服务器: ${selectedRowKeys.join(', ')}`);
        // 这里可以添加后续逻辑
    };

    useEffect(() => {
        lobeChat.getPluginMessage().then(setData);
    }, []);

    useEffect(() => {
        lobeChat.getPluginPayload().then((payload) => {
            setPayload(payload?.arguments ? { ...payload.arguments, name: payload.name } : payload);
            if (payload?.name === 'executeShell') {
                setCommand(payload?.arguments?.command || '');
                setIpList(Array.isArray(payload?.arguments?.ips) ? payload.arguments.ips : []);
            }
        });
    }, []);

    // 查询服务器
    const handleQueryServers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/query', {
                method: 'POST',
                body: JSON.stringify({ keyword: filterIp }),
            });
            const list = await res.json();
            setServers(list.servers || []);
            setLoading(false);
        } catch (e) {
            message.error('查询失败');
            setLoading(false);
        }
    };

    // 执行命令
    const handleExecuteShell = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/execute', {
                method: 'POST',
                body: JSON.stringify({ command, ips: ipList }),
            });
            const result = await res.json();
            setResult(result.success ? '执行成功' : '执行失败');
            setLoading(false);
        } catch (e) {
            setResult('执行失败');
            setLoading(false);
        }
    };

    // 取消操作
    const handleCancel = () => {
        setResult('已取消');
    };

    // queryServers界面
    if (payload?.name === 'queryServers') {

        return (
            <Center style={{ height: 400, position: 'relative', width: '100%' }}>
                <div style={{ width: 800 }}>
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Input
                                placeholder="根据IP过滤"
                                value={filterIp}
                                onChange={(e) => setFilterIp(e.target.value)}
                                style={{ width: 200 }}
                            />
                            <Button type="primary" loading={loading} onClick={handleQueryServers}>
                                查询
                            </Button>
                            <Button type="default" onClick={handleConfirm}>
                                确认
                            </Button>
                        </div>
                    </div>
                    <Table
                        dataSource={servers.filter((s) => !filterIp || s.ip.includes(filterIp))}
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
    }

    // executeShell界面
    if (payload?.name === 'executeShell') {
        if (result) {
            return (
                <Center style={{ height: 180 }}>
                    <Card>
                        <div style={{ fontSize: 18, fontWeight: 500 }}>{result}</div>
                    </Card>
                </Center>
            );
        }
        return (
            <Center style={{ height: 320, position: 'relative', width: '100%' }}>
                <div style={{ width: 600 }}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 500, marginBottom: 4 }}>命令：</div>
                        <Input.TextArea
                            value={command}
                            onChange={e => setCommand(e.target.value)}
                            rows={2}
                            placeholder="请输入Shell命令"
                            style={{ marginBottom: 12 }}
                        />
                        <div style={{ fontWeight: 500, marginBottom: 4 }}>IP数组：</div>
                        <List
                            bordered
                            dataSource={ipList}
                            style={{ marginBottom: 8 }}
                            renderItem={(ip, idx) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            danger
                                            size="small"
                                            onClick={() => setIpList(ipList.filter((_, i) => i !== idx))}
                                            key="delete"
                                        />
                                    ]}
                                >
                                    <Input
                                        value={ip}
                                        onChange={e => {
                                            const newIps = [...ipList];
                                            newIps[idx] = e.target.value;
                                            setIpList(newIps);
                                        }}
                                        style={{ width: 180 }}
                                    />
                                </List.Item>
                            )}
                        />
                        <Button
                            icon={<PlusOutlined />}
                            type="dashed"
                            onClick={() => setIpList([...ipList, ''])}
                            style={{ width: '100%' }}
                        >
                            新增IP
                        </Button>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Button type="primary" loading={loading} onClick={handleExecuteShell}>
                            执行
                        </Button>
                        <Button onClick={handleCancel}>取消</Button>
                    </div>
                </div>
            </Center>
        );
    }

    // 默认界面
    return (
        <Center style={{ height: 180 }}>
            <div>请选择操作方法</div>
        </Center>
    );
});

export default Render;
// ...existing code...