Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Compétences'
    },
    xAxis: {
        categories: ['Maquetter une application', 'Réaliser une interface utilisateur web statique et adaptable', 
        'Développer une interface utilisateur web dynamique', 'Réaliser une interface utilisateur avec une solution de gestion de contenu ou e-commerce', 
        'Créer une base de données', "Développer les composants d'accès aux données", "Développer la partie back-end d'une application web ou web mobile", 
        'Elaborer et mettre en oeuvre des composants dans une application de gestion de contenu ou e-commerce', 
        'Utiliser l’anglais dans son activité professionnelle en développement web et web mobile', 
        'Actualiser et partager ses compétences en développement web et web mobile']
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
