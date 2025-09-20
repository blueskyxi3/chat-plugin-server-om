import '@ant-design/v5-patch-for-react-19';
import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import { memo, useEffect, useState } from 'react';
import { Center } from 'react-layout-kit';
import ExecuteShell from '@/components/ExecuteShell';
import QueryServers from '@/components/QueryServers';

const Render = memo(() => {
  const [data, setData] = useState<any>();
  const [payload, setPayload] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [filterIp, setFilterIp] = useState('');
  const [servers, setServers] = useState<any[]>([]);
  const [result, setResult] = useState<Array<{ code: string, ip: string, stdout: string, stderr: string }> | null>(null);


  // executeShell编辑相关
  const [command, setCommand] = useState('');
  const [ipList, setIpList] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    lobeChat.getPluginMessage().then(setData);
  }, []);

  useEffect(() => {
    lobeChat.getPluginPayload().then((payload) => {
      console.log('payload-->', payload);
      setPayload(payload?.arguments ? { ...payload.arguments, name: payload.name } : payload);
      if (payload?.name === 'executeShell') {
        setCommand(payload?.arguments?.command || '');
        setIpList(Array.isArray(payload?.arguments?.ips) ? payload.arguments.ips : []);
      } else if (payload?.name === 'queryServers') {
        // 初始化keyword
        const keyword = payload?.arguments?.keyword || '';
        setFilterIp(keyword);
        handleQueryServers(keyword);
      }
    });
  }, []);

  // 查询服务器
  const handleQueryServers = async (keyword?: string) => {
    setLoading(true);
    try {
      // 使用传入的keyword参数，如果没有则使用filterIp状态
      const searchKeyword = filterIp == '' ? keyword : filterIp;
      const manager_server_url = 'https://n8n.example.com/webhook/manager-server?keyword=' + searchKeyword;
      console.log('manager_server_url------->', manager_server_url);
      // 从接口获取服务器数据
      const res = await fetch(manager_server_url);
      const data = await res.json();
      console.log('查询服务器结果:', data);
      if (data && data[0].servers) {
        setServers(data[0].servers);
        // 自动选中所有查询出来的服务器
        setSelectedRowKeys(data[0].servers.map((server: any) => server.ip));
      } else {
        setServers([]);
        setSelectedRowKeys([]);
      }

      setLoading(false);
    } catch (e) {
      console.error('查询服务器失败:', e);
      setServers([]);
      setSelectedRowKeys([]);
      setLoading(false);
    }
  };

  // 执行命令
  const handleExecuteShell = async () => {
    setLoading(true);
    try {
      const webhookUrl = 'https://n8n.example.com/webhook/execute-shell';

      // 准备请求数据
      const requestData = {
        command: command,
        ips: ipList.filter(ip => ip.trim() !== '') // 过滤掉空IP
      };

      console.log('发送请求数据:', requestData);

      // 发送POST请求到webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // 处理响应
      const result = await response.json();
      console.log('收到响应:', result);

      // 设置结果
      setResult(result);
      setLoading(false);

      // 发送消息到LobeChat
      lobeChat.setPluginMessage({
        result: result,
        command: command,
        ips: ipList
      });
    } catch (e) {
      console.error('执行命令失败:', e);
      setResult('执行失败: ' + (e instanceof Error ? e.message : '未知错误'));
      setLoading(false);
    }
  };


  // 取消操作
  const handleCancel = () => {
    setResult('已取消');
  };

  if (payload?.name === 'queryServers') {
    return (
      <QueryServers
        loading={loading}
        filterIp={filterIp}
        setFilterIp={setFilterIp}
        servers={servers}
        setServers={setServers}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        handleQueryServers={handleQueryServers}
      />
    );
  }

  if (payload?.name === 'executeShell') {
    return (
      <ExecuteShell
        loading={loading}
        command={command}
        setCommand={setCommand}
        ipList={ipList}
        setIpList={setIpList}
        handleExecuteShell={handleExecuteShell}
        handleCancel={handleCancel}
        result={result}
      />
    );
  }

  return (
    <Center style={{ height: 180 }}>
      <div>请选择操作方法</div>
    </Center>
  );
});

export default Render;