import { lobeChat } from '@lobehub/chat-plugin-sdk/client';
import { Button } from 'antd';
import { memo, useEffect, useState } from 'react';
import { Center } from 'react-layout-kit';

import Data from '@/components/DataRender';
import { fetchClothes } from '@/services/clothes';
import { ResponseData } from '@/type';

const Render = memo(() => {
  console.log('Render start...');
  // 初始化渲染状态
  const [data, setData] = useState<ResponseData>();

  // 初始化时从主应用同步状态
  useEffect(() => {
    console.log('初始化时从主应用同步状态');
    lobeChat.getPluginMessage().then(setData);
  }, []);

  // 记录请求参数
  const [payload, setPayload] = useState<any>();

  useEffect(() => {
    console.log('[payload-1]', payload);
    lobeChat.getPluginPayload().then((payload) => {
      console.log('[payload-2]', payload);
      if (payload.name === 'recommendClothes') {
        setPayload(payload.arguments);
      }
    });
  }, []);

  const fetchData = async () => {
    const data = await fetchClothes(payload);
    console.log('[fetchData]', data);
    setData(data);
    lobeChat.setPluginMessage(data);
  };
  const isDataUndefined = data === undefined;
  console.log('[data]', data, payload, isDataUndefined);
  return isDataUndefined ? (
    <Data {...data} />
  ) : (
    <Center style={{ height: 150 }}>
      <Button
        disabled={!payload}
        onClick={() => {
          fetchData();
        }}
        type={'primary'}
      >
        查询衣物
      </Button>
    </Center>
  );
});

export default Render;
