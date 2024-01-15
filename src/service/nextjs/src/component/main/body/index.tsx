'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import style from '../../../style/main/body/index.module.css';
import ChattingRoom from './chatting-room';
import ChattingModeToggle from './chatting-mode';
import { Box, Skeleton } from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomSnackbar from '@/component/profile/modifyProfile/customSnackbar';
import Chatroom from '@/type/chatroom.type';
import { Channel, ChannelVisibility } from '@/type/channel.type';
import useFetchData from '@/hook/useFetchData';
import { AxiosError } from 'axios';
import SocketContext from '@/context/socket.context';
import useListeningChannelEvent from '@/hook/useListeningChannelEvent';

export type ChattingMode = 'normal' | 'private';

/** channel api */
const chatData = [
	{
		id: '1',
		title: 'Mockup data 1',
		visibility: 'public' as ChannelVisibility,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '2',
		title: 'Mockup data 2',
		visibility: 'protected' as ChannelVisibility,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '3',
		title: 'Mockup data 3',
		visibility: 'protected' as ChannelVisibility,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '4',
		title: 'Mockup data 4',
		visibility: 'protected ' as ChannelVisibility,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '5',
		title: 'Mockup data 5',
		visibility: 'protected' as ChannelVisibility,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

/** chat room api */
const dmData = [
	{
		id: '1',
		title: 'Mockup data 1',
		visibility: 'public' as ChannelVisibility,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '2',
		title: 'Mockup data 2',
		visibility: 'protected' as ChannelVisibility,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '3',
		title: 'Mockup data 3',
		visibility: 'protected' as ChannelVisibility,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '4',
		title: 'Mockup data 4',
		visibility: 'protected' as ChannelVisibility,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: '5',
		title: 'Mockup data 5',
		visibility: 'protected' as ChannelVisibility,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

const MainPageBody = () => {
	const [mode, setMode] = useState<ChattingMode>('normal');
	const router = useRouter();
	const [showSnackbar, setShowSnackbar] = useState(false);
	const [message, setMessage] = useState<string>('');
	const { sockets } = useContext(SocketContext);
	const { channelSocket } = sockets;

	//@todo api test
	/** channel api*/
	const {
		data: chatDatas,
		isLoading: isChatLoading,
		error: chatError,
	} = useFetchData<Channel[]>('/channel');

	/** chatroom api **/
	const {
		data: dmDatas,
		isLoading: isDmLoading,
		error: dmError,
	} = useFetchData<Chatroom[]>('/chatroom');

	const navigateChannel = useCallback(
		(channelId: string) => {
			channelSocket?.emit('join', { channelId }, (res: any) => {
				console.log(res);
				if (res.enter) router.push(`/chat/${channelId}/common`);
				else {
					setMessage('채널 입장에 실패했습니다.');
					setShowSnackbar(true);
				}
			});
		},
		[channelSocket],
	);

	const getView = (
		isLoading: boolean,
		datas: Channel[] | Chatroom[] | undefined,
		error: AxiosError | null | undefined,
	) => {
		if (isLoading) return <Skeleton />;
		if (error) return <div>데이터를 불러오지 못했습니다.</div>;
		if (datas?.length === 0) return <div>데이터가 없습니다.</div>;
		return datas?.map(data => (
			<Box
				key={data.id}
				onClick={() =>
					mode === 'normal' ? navigateChannel(data?.id) : router.push(`/chat/${data?.id}/private`)
				}
				style={{ textDecoration: 'none' }}
			>
				{/*@todo dm방 제목 넣어주기*/}
				<ChattingRoom
					title={mode === 'normal' ? (data as Channel)?.title : 'DM방입니다.'}
					visibility={
						mode === 'normal'
							? ((data as Channel)?.visibility as 'public' | 'protected')
							: 'private'
					}
				/>
			</Box>
		));
	};
	return (
		<div className={style.container}>
			<div>
				<CustomSnackbar
					open={showSnackbar}
					onClose={() => setShowSnackbar(false)}
					message={message}
					success={false}
				/>
				<ChattingModeToggle mode={mode} setMode={setMode} />
				<div style={{ overflowY: 'scroll', overflowX: 'hidden' }}>
					{mode === 'normal'
						? getView(isChatLoading, chatData, chatError)
						: getView(isDmLoading, dmData, dmError)}
				</div>
			</div>
		</div>
	);
};

export default MainPageBody;
