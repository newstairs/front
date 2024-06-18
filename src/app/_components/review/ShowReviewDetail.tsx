'use client'
import React ,{ useEffect,useState } from 'react';

interface Detail{
  content:string,
  setting_show:(x:boolean)=>void
}
const ReviewDetails: React.FC<Detail> = ({ content, setting_show }) => {
	const close = () => {
		setting_show(false);
		console.log("close");
	}

	return (
		<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
				<div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
						<div className="p-5">
								<div className="text-gray-800 text-sm">
										{content}
								</div>
						</div>
						<button onClick={close} 
										className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800">
								<span className="text-2xl">&times;</span>
						</button>
				</div>
		</div>
	)
}

export default ReviewDetails;

