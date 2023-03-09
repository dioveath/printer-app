import { ActivityIndicator } from 'react-native'
import React from 'react'

const CustomProgressIndicator = ({ size }) => <ActivityIndicator color={'#f97316'} size={size ? size : 'large'}/>;

export { CustomProgressIndicator };