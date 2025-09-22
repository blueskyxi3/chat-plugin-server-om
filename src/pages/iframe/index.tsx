import '@ant-design/v5-patch-for-react-19';
import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import React , { memo, useEffect, useState } from 'react';
import { Center } from 'react-layout-kit';
import ExecuteShell from '@/components/ExecuteShell';
import QueryServers from '@/components/QueryServers';

const Render = memo(() => {
  const [data, setData] = useState<any>();
  const [payload, setPayload] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [filterIp, setFilterIp] = useState('');
  const [servers, setServers] = useState<any[]>([]);
  const [result, setResult] = useState<Array<{ code: string, ip: string,  stderr: string, stdout: string, }> | null>(null);

  // executeShell编辑相关
  const [command, setCommand] = useState('');
  const [ipList, setIpList] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  console.log('data--->', data);
  
  // 查询服务器
  const handleQueryServers = async (keyword?: string) => {
    setLoading(true);
    try {
      // 使用传入的keyword参数，如果没有则使用filterIp状态
      const searchKeyword = filterIp === '' ? keyword : filterIp;
      const manager_server_url = 'https://n8n.example.com/webhook/manager-server?keyword=' + searchKeyword;
      // console.log('manager_server_url------->', manager_server_url);
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
    } catch (error) {
      console.error('查询服务器失败:', error);
      setServers([]);
      setSelectedRowKeys([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    lobeChat.getPluginMessage().then(setData);
  }, []);

  useEffect(() => {
    lobeChat.getPluginPayload().then((payload: any) => {
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


  // 执行命令
  const handleExecuteShell = async () => {
    setLoading(true);
    try {
      const webhookUrl = 'https://n8n.example.com/webhook/execute-shell';

      // 准备请求数据
      const requestData = {
        command: command,
        ips: ipList.filter((ip: string) => ip.trim() !== '') // 过滤掉空IP
      };

      console.log('发送请求数据:', requestData);

      // 发送POST请求到webhook
      const response = await fetch(webhookUrl, {
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      // 处理响应
      const result = await response.json();
      console.log('收到响应:', result);

      // 设置结果
      setResult(result);
      setLoading(false);

      // 发送消息到LobeChat
      lobeChat.setPluginMessage({
        command: command,
        result: result,
      });
      lobeChat.getPluginMessage().then((msg: any)=>{
         lobeChat.triggerAIMessage(msg);
        });
    } catch (error) {
      console.error('执行命令失败:', error);
      setResult([{
        code: "400",
        ip: "N/A",
        stderr: '执行失败: ' + (error instanceof Error ? error.message : '未知错误'),
        stdout: "",
      }]);
      setLoading(false);
    }
  };


  // 取消操作
  const handleCancel = () => {
        setResult([{
        code: "400",
        ip: "N/A",
        stderr: "",
        stdout: "已取消",
      }]);
  };

  if (payload?.name === 'queryServers') {
    return (
      <QueryServers
        filterIp={filterIp}
        handleQueryServers={handleQueryServers}
        loading={loading}
        selectedRowKeys={selectedRowKeys}
        servers={servers}
        setFilterIp={setFilterIp}
        setSelectedRowKeys={setSelectedRowKeys}
        setServers={setServers}
      />
    );
  }

  if (payload?.name === 'executeShell') {
    return (
      <ExecuteShell
        command={command}
        handleCancel={handleCancel}
        handleExecuteShell={handleExecuteShell}
        ipList={ipList}
        loading={loading}
        result={result}
        setCommand={setCommand}
        setIpList={setIpList}
        
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