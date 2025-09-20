import { Button, Input, Card, List } from 'antd';
import { Center } from 'react-layout-kit';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const ExecuteShell = ({
    loading,
    command,
    setCommand,
    ipList,
    setIpList,
    handleExecuteShell,
    handleCancel,
    result,
}: any) => {
    if (result) {


        return (
            <Center style={{ height: '100%', width: '100%', paddingTop: '20px' }}>
                <Card
                    style={{
                        width: '100%',
                        backgroundColor: '#1e1e1e',
                        border: '1px solid #333',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
                    }}
                    bodyStyle={{ padding: '12px' }}
                >
                    <div style={{
                        fontSize: 14,
                        color: '#0f0',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#0f0',
                            marginRight: '8px',
                            animation: 'blink 1s infinite'
                        }}></span>
                        $ 执行结果
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            color: '#fff',
                            fontSize: '12px'
                        }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #444' }}>
                                    <th style={{ padding: '8px', textAlign: 'left', color: '#0f0' }}>ip</th>
                                    <th style={{ padding: '8px', textAlign: 'left', color: '#0f0' }}>code</th>
                                    <th style={{ padding: '8px', textAlign: 'left', color: '#0f0' }}>stdout</th>
                                    <th style={{ padding: '8px', textAlign: 'left', color: '#0f0' }}>stderr</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                                        <td style={{ padding: '8px' }}>{item.ip}</td>
                                        <td style={{ padding: '8px' }}>
                                            <span style={{
                                                color: item.code === '0' ? '#0f0' : '#f00'
                                            }}>
                                                {item.code === '0' ? '成功' : '失败'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '8px', wordBreak: 'break-all' }}>{item.stdout || '-'}</td>
                                        <td style={{ padding: '8px', wordBreak: 'break-all' }}>
                                            <span style={{ color: item.stderr ? '#f00' : '#888' }}>
                                                {item.stderr || '-'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <style jsx>{`
                    @keyframes blink {
                        0% { opacity: 1; }
                        50% { opacity: 0; }
                        100% { opacity: 1; }
                    }
                `}</style>
                </Card>
            </Center>
        );
    }


    return (
        <Center style={{ height: 280, position: 'relative', width: '100%' }}>
            <div style={{ width: '100%' }}>
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 8 }}>
                        {ipList.map((ip, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', width: 'calc(33.333% - 6px)' }}>
                                <Input
                                    value={ip}
                                    onChange={e => {
                                        const newIps = [...ipList];
                                        newIps[idx] = e.target.value;
                                        setIpList(newIps);
                                    }}
                                    style={{ flex: 1 }}
                                />
                                <Button
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    danger
                                    size="small"
                                    onClick={() => setIpList(ipList.filter((_: any, i: number) => i !== idx))}
                                />
                            </div>
                        ))}</div>
                    <Button
                        icon={<PlusOutlined />}
                        type="dashed"
                        size="small"
                        onClick={() => setIpList([...ipList, ''])}
                        style={{ height: '32px', width: '32px' }}
                    />

                </div>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                    <Button type="primary" loading={loading} onClick={handleExecuteShell}>
                        执行
                    </Button>
                    <Button onClick={handleCancel}>取消</Button>
                </div>
            </div>
        </Center>
    );
};

export default ExecuteShell;