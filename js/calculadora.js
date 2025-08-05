        document.getElementById('renewableForm').addEventListener('submit', function(e) {
            e.preventDefault();
            calculateRenewablePercentage();
        });

        function calculateRenewablePercentage() {
            // Obtener valores del formulario
            const totalConsumption = parseFloat(document.getElementById('totalConsumption').value) || 0;
            
            // Capacidades instaladas
            const solar = parseFloat(document.getElementById('solar').value) || 0;
            const wind = parseFloat(document.getElementById('wind').value) || 0;
            const hydro = parseFloat(document.getElementById('hydro').value) || 0;
            const geothermal = parseFloat(document.getElementById('geothermal').value) || 0;
            const biomass = parseFloat(document.getElementById('biomass').value) || 0;
            const other = parseFloat(document.getElementById('other').value) || 0;

            // Factores de capacidad (convertir de % a decimal)
            const solarFactor = (parseFloat(document.getElementById('solarFactor').value) || 20) / 100;
            const windFactor = (parseFloat(document.getElementById('windFactor').value) || 35) / 100;
            const hydroFactor = (parseFloat(document.getElementById('hydroFactor').value) || 45) / 100;
            const geothermalFactor = (parseFloat(document.getElementById('geothermalFactor').value) || 80) / 100;
            const biomassFactor = (parseFloat(document.getElementById('biomassFactor').value) || 70) / 100;
            const otherFactor = (parseFloat(document.getElementById('otherFactor').value) || 40) / 100;

            // Calcular capacidad total instalada
            const totalCapacity = solar + wind + hydro + geothermal + biomass + other;

            // Calcular producción mensual por fuente (kW * factor * # horas * 30 días)
            const hoursPerMonth = 8 * 30; // horas por mes
            
            const solarProduction = solar * solarFactor * hoursPerMonth;
            const windProduction = wind * windFactor * hoursPerMonth;
            const hydroProduction = hydro * hydroFactor * hoursPerMonth;
            const geothermalProduction = geothermal * geothermalFactor * hoursPerMonth;
            const biomassProduction = biomass * biomassFactor * hoursPerMonth;
            const otherProduction = other * otherFactor * hoursPerMonth;

            // Producción total renovable mensual
            const totalRenewableProduction = solarProduction + windProduction + hydroProduction + geothermalProduction + biomassProduction + otherProduction;

            // Energía renovable efectivamente consumida (no puede ser mayor al consumo total)
            const renewableConsumed = Math.min(totalRenewableProduction, totalConsumption);

            // Porcentaje de energía renovable
            const renewablePercentage = totalConsumption > 0 ? (renewableConsumed / totalConsumption) * 100 : 0;

            // Mostrar resultados
            displayResults({
                totalConsumption,
                totalCapacity,
                totalRenewableProduction,
                renewableConsumed,
                renewablePercentage,
                sources: {
                    solar: { capacity: solar, production: solarProduction },
                    wind: { capacity: wind, production: windProduction },
                    hydro: { capacity: hydro, production: hydroProduction },
                    geothermal: { capacity: geothermal, production: geothermalProduction },
                    biomass: { capacity: biomass, production: biomassProduction },
                    other: { capacity: other, production: otherProduction }
                }
            });
        }

        function displayResults(data) {
            // Mostrar sección de resultados
            const resultsDiv = document.getElementById('results');
            resultsDiv.classList.add('show');

            // Actualizar valores principales
            document.getElementById('totalConsumptionResult').textContent = `${data.totalConsumption.toFixed(2)} kWh`;
            document.getElementById('totalCapacityResult').textContent = `${data.totalCapacity.toFixed(2)} kW`;
            document.getElementById('renewableProductionResult').textContent = `${data.totalRenewableProduction.toFixed(2)} kWh`;
            document.getElementById('renewableConsumedResult').textContent = `${data.renewableConsumed.toFixed(2)} kWh`;
            document.getElementById('renewablePercentageResult').textContent = `${data.renewablePercentage.toFixed(1)}%`;

            // Actualizar círculo de porcentaje
            const circle = document.getElementById('percentageCircle');
            const percentageText = document.getElementById('percentageText');
            const percentageDegrees = (data.renewablePercentage / 100) * 360;
            
            circle.style.setProperty('--percentage', `${percentageDegrees}deg`);
            percentageText.textContent = `${data.renewablePercentage.toFixed(1)}%`;

            // Actualizar desglose por fuentes
            const sourcesDiv = document.getElementById('energySources');
            sourcesDiv.innerHTML = '';

            const sourceNames = {
                solar: '☀️ Solar',
                wind: '💨 Eólica',
                hydro: '💧 Hidroeléctrica',
                geothermal: '🌋 Geotérmica',
                biomass: '🌿 Biomasa',
                other: '⚡ Otras'
            };

            Object.entries(data.sources).forEach(([key, source]) => {
                if (source.capacity > 0) {
                    const sourceDiv = document.createElement('div');
                    sourceDiv.className = 'source-item';
                    sourceDiv.innerHTML = `
                        <div class="source-name">${sourceNames[key]}</div>
                        <div class="source-capacity">${source.capacity.toFixed(2)} kW</div>
                        <div style="font-size: 0.9em; margin-top: 5px;">${source.production.toFixed(2)} kWh/mes</div>
                    `;
                    sourcesDiv.appendChild(sourceDiv);
                }
            });

            // Scroll suave hacia los resultados
            resultsDiv.scrollIntoView({ behavior: 'smooth' });
        }