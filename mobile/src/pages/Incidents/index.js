import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import logoImg from '../../assets/logo.png';
import style from './style';

import api from '../../services/api';

export default function Incidents() {
	const nav = useNavigation();
	const [ incidents, setIncidents ] = useState([]);
	const [ total, setTotal ] = useState(0);
	const [ page, setPage ] = useState(1);
	const [ loading, setLoading ] = useState(false);

	function navigateToDetail(incident) {
		nav.navigate('Detail', { incident });
	}

	async function loadIncident() {
		if (loading) {
			return;
		}

		if (total > 0 && incidents.length === total) {
			return;
		}

		setLoading(true);

		const res = await api.get('incidents', {
			params: { page }
		});

		setIncidents([ ...incidents, ...res.data ]);
		setTotal(res.headers[ 'x-total-count' ]);
		setPage(page + 1);
		setLoading(false);
	}

	useEffect(() => {
		loadIncident();
	}, []);

	return (
		<View style={ style.container } >
			<View style={ style.header } >
				<Image source={ logoImg } />
				<Text style={ style.headerText } >
					Total de <Text style={ style.headerTextBold }>0 casos</Text>.
				</Text>

				<Text style={ style.title }>Bem-vindo(a)!</Text>
				<Text style={ style.description }>Escolha um dos casos abaixo e salve o dia!</Text>
			</View>

			<FlatList
				style={ style.incidentList }
				data={ incidents }
				keyExtractor={ incident => String(incident.id) }
				showsVerticalScrollIndicator={ false }
				onEndReached={ loadIncident }
				onEndReachedThreshold={ 0.2 }
				renderItem={ ({ item: incident }) => (
					<View style={ style.incident }>
						<Text style={ style.incidentProperty }>ONG: </Text>
						<Text style={ style.incidentValue }>{ incident.name }</Text>

						<Text style={ style.incidentProperty }>CASO: </Text>
						<Text style={ style.incidentValue }>{ incident.title }</Text>

						<Text style={ style.incidentProperty }>VALOR: </Text>
						<Text style={ style.incidentValue }>{ Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value) }</Text>

						<TouchableOpacity style={ style.detailsButton } onPress={ () => navigateToDetail(incident) }>

							<Text style={ style.detailsButtonText }>Ver mais detalhes</Text>
							<Feather name="arrow-right" size={ 16 } color="#e02041" />
						</TouchableOpacity>
					</View>
				) }
			/>
		</View>
	);
}