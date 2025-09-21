import { Button, Input, Card } from 'antd';
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
            <Center style={{ height: '100%', paddingTop: '20px', width: '100%',  }}>
                <Card
                    bodyStyle={{ padding: '12px' }}
                    style={{
                        backgroundColor: '#1e1e1e',
                        border: '1px solid #333',
                        fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                        width: '100%',
                    }}
                >
                    <div style={{
                        alignItems: 'center',
                        color: '#0f0',
                        display: 'flex',
                        fontSize: 14,
                        marginBottom: '8px',
                    }}>
                        <span style={{
                            animation: 'blink 1s infinite',
                            backgroundColor: '#0f0',
                            borderRadius: '50%',
                            display: 'inline-block',
                            height: '8px', 
                            marginRight: '8px',
                            width: '8px',
                        }}></span>
                        $ 执行结果
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            borderCollapse: 'collapse',
                            color: '#fff',
                            fontSize: '12px',
                            width: '100%',
                        }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #444' }}>
                                    <th style={{  color: '#0f0', padding: '8px', textAlign: 'left', }}>ip</th>
                                    <th style={{  color: '#0f0', padding: '8px', textAlign: 'left', }}>code</th>
                                    <th style={{  color: '#0f0', padding: '8px', textAlign: 'left', }}>stdout</th>
                                    <th style={{  color: '#0f0', padding: '8px', textAlign: 'left', }}>stderr</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((item: { code: string, ip: string,  stderr: string, stdout: string, }, index:number) => (
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
                        onChange={e => setCommand(e.target.value)}
                        placeholder="请输入Shell命令"
                        rows={2}
                        style={{ marginBottom: 12 }}
                        value={command}
                    />
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>IP数组：</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 8 }}>
                        {ipList.map((ip:string, idx:number) => (
                            <div key={idx} style={{alignItems: 'center', display: 'flex',  gap: '4px', width: 'calc(33.333% - 6px)' }}>
                                <Input
                                    onChange={e => {
                                        const newIps = [...ipList];
                                        newIps[idx] = e.target.value;
                                        setIpList(newIps);
                                    }}
                                    style={{ flex: 1 }}
                                    value={ip}
                                />
                                <Button
                                   danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => setIpList(ipList.filter((_: any, i: number) => i !== idx))}
                                    size="small"
                                    type="text"
                                />
                            </div>
                        ))}</div>
                    <Button
                        icon={<PlusOutlined />}
                        onClick={() => setIpList([...ipList, ''])}
                        size="small"
                        style={{ height: '32px', width: '32px' }}
                        type="dashed"
                    />

                </div>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                    <Button  loading={loading} onClick={handleExecuteShell} type="primary">
                        执行
                    </Button>
                    <Button onClick={handleCancel}>取消</Button>
                </div>
            </div>
        </Center>
    );
};

export default ExecuteShell;