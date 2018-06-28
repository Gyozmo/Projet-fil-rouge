Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Compétences'
    },
    xAxis: {
        categories: ['Maquetter une application', 'Concevoir une base de données', 'Mettre en place une base de données',
                     'Développer une interface utilisateur', 'Développer des composants d\'accès aux données',
                    'Développer des pages web en lien avec une base de données','Mettre en œuvre une solution de gestion de contenu ou e-commerce','Développer une application simple de mobilité numérique','Utiliser l’anglais dans son activité professionnelle en informatique', 'Actualiser et partager ses competences en informatique','Organiser son activité en developpement informatique']
    },
    yAxis: {
        min: 0,
        max: 100,
        title: {
            text: 'Compétences acquises en pourcentages'
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        bar: {
            series: 'normal'
        }
    },
    series: [{
        name: 'John',
        data: [5, 3, 4, 7, 2, 6, 5, 5, 5, 5, 5]
    }, {
        name: 'Jane',
        data: [2,7,4]
    }, {
        name: 'Joe',
        data: [4,56,67,78,67]
    }]
});
