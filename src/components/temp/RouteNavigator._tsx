// src/components/RouteNavigator.tsx (фрагмент)
import MicroMapSquare from './MicroMapSquare';
import MicroMapCorridor from './MicroMapCorridor';
import MacroMap from './MacroMap';

// Внутри компонента, где steps = результат findRoute()
{steps.map((step, index) => {
    const isLast = index === steps.length - 1;
    const nextStep = steps[index + 1];
    
    // Определяем направление движения для микро-карты
    const currentSide = determineCurrentSide(step, nextStep); 

    if (step.type === 'square') {
        return (
            <div key={step.id}>
                <MicroMapSquare square={step.data} currentSide={currentSide} />
                {!isLast && (
                    <MacroMap 
                        neighbors={getNeighborsForMacro(step.id, graph)} 
                    />
                )}
            </div>
        );
    }

    if (step.type === 'corridor') {
        return (
            <div key={step.id}>
                <MicroMapCorridor corridor={step.data} />
            </div>
        );
    }
})}