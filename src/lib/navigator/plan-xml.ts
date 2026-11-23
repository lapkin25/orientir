// Стены зеркальны исходному Plan.xml, как и в существующих коридорах.
// Знак «-» оставляет сторону неопределённой, если её нет в источнике.
const corridorExtensions: [number, string, string, string, string, string][] = [
    [3, "hall3_food", "hall3_main", "food3", "Проход мимо буфета", "R:буф=Буфет|R:голубиная=Голубиная падь|-:экран=Экран"],
    [3, "canteen3", "canteen3", "canteen3_end", "Проход к столовой", "R:стол=Столовая|L:студотряды=Студотряды"],
    [3, "passage4", "passage4", "branch4300", "Переход в корпус 4", "R:1306=Мужской туалет|R:1308=Женский туалет|L:блин=Блинная|L:4301|L:4303|L:4305|L:4302|L:4307|L:4309|L:4304|L:4306"],
    [3, "branch4311", "branch4311", "branch4311_end", "Коридор 4311–4315", "L:4311|L:4313|L:4315"],
    [3, "branch4302", "branch4302", "branch4302_end", "Проход к аудитории 4302", "R:4302"],
    [4, "wing4400", "wing4400", "wing4400_end", "Коридор 4401–4413", "R:4401|R:4403|R:4405|L:4402|R:4407|R:4409|R:4411|R:4413|L:4404|L:4406"],
    [4, "wing2400", "wing2400", "wing2400_end", "Проход к аудитории 2411", "R:2411"],
    [5, "landing5_rooms", "landing5_rooms", "landing5_end", "Проход у лестницы № 5", "R:1533|R:1531"],
    [5, "main5", "main5", "corner5", "Коридор 1519–1536", "L:1536|R:1529|L:1534|L:1532|R:1527|L:1530|R:1525|L:1528|R:1523|L:1526|L:1524|R:1521|L:1522|R:1519"],
    [5, "branch1517", "branch1517", "branch1517_end", "Проход 1515–1518", "R:1517|L:1518|R:1515"],
    [5, "west5", "west5", "small5", "Коридор 1503–1516", "L:1516|L:1514|R:1513|R:1511|R:1509|L:1512|R:1507|L:1510|L:1508|R:1505|L:1506|R:1503|L:1504"],
    [5, "branch1501", "branch1501", "branch1501_end", "Проход к аудитории 1501", "R:1501"],
    // В источнике крыло 1625–1653 вложено в этаж 5; сохраняем его привязку без догадки о смене этажа.
    [5, "wing1625", "wing1625", "wing1625_end", "Крыло 1625–1653", "R:1625|R:1627|L:1626|R:1629|L:1628|R:1631|L:1630|R:1633|L:1632|R:1635|L:1634|R:1637|L:1636|R:1639|L:1638|R:1641|L:1640|R:1643|L:1642|R:1645|L:1644|R:1647|L:1646, 1648|R:1649|L:1650|R:1651|L:1652|R:1653"],
    [5, "wing6600", "wing6600", "corner6600", "Проход через эскалатор", "-:эскалатор=Эскалатор|R:6601|L:6602|L:6604|R:6603|L:6604а|R:6605|L:6606|R:6607|L:6610|-:автоматы=Торговые автоматы"],
    [5, "wing8100", "wing8100", "corner8100", "Проход в учебный корпус 8", "R:8119|R:8116|L:8117|R:8114|L:8115|R:8116|L:8113|R:8112|L:8110|R:8109|R:8108"],
    [5, "toilets8100", "toilets8100", "corner8102", "Проход у туалетов корпуса 8", "R:8106=Женский туалет|R:8105=Мужской туалет|L:8104|L:8103"],
    [5, "branch8102", "branch8102", "branch8102_end", "Проход 8101–8102", "R:8102|L:8101"],
    [5, "wing2500", "wing2500", "wing2500_end", "Проход к аудитории 2501", "R:2501"],
    [6, "main6", "main6", "corner6", "Коридор 1603–1624", "R:1623|R:1624|L:1622|R:1621|L:1620|R:1619|R:1617|L:1618|R:1615|L:1616|R:1613|R:1611|L:1614|R:1609|L:1612|R:1607|L:1610|L:1608|R:1603|L:1606|L:1604"],
    [6, "branch1601", "branch1601", "branch1601_end", "Проход 1601–1602", "L:1602|R:1601"],
    [6, "wing2604", "wing2604", "corner2604", "Проход к аудитории 2604", "R:2604"],
    [6, "branch2600", "branch2600", "branch2600_end", "Проход к аудитории 2600", "L:2600"],
    [6, "branch2601", "branch2601", "corner2601", "Проход к аудитории 2601", "L:2601"],
    [6, "wing2600", "wing2600", "corner2611", "Коридор 2603–2611", "R:2603|R:2605|L:2606|R:2607|R:2609|R:2609a|-:2611"],
    [6, "branch2611b", "branch2611b", "corner2611b", "Проход к аудитории 2611б", "R:2611б"],
    [6, "branch2611v", "branch2611v", "branch2611v_end", "Проход 2611в–2611г", "R:2611в|R:2611г"],
    [6, "wing8200", "wing8200", "wing8200_end", "Коридор корпуса 8", "R:8202|R:8205|R:8206|L:студ=СтудПространство|R:8207"],
    [4.5, "wing5400", "wing5400", "wing5400_end", "Коридор 5401–5413", "L:5406|L:5408|L:5412|R:5411|R:5413|R:4400|R:5405|R:5409|R:5403|R:5401"],
    [5.5, "wing5500", "wing5500", "corner5500", "Коридор 5501–5511", "L:5506|R:5511|L:5504|R:5507|L:5502|R:5505|R:5503|R:5501"],
    [5.5, "branch5510", "branch5510", "branch5510_end", "Проход 5510–5518", "R:5510|R:5512|L:5513|L:5515|R:5516|L:5517|-:5518"],
    [6.5, "wing5600", "wing5600", "corner5600", "Коридор 5601–5613", "R:5613|L:5608|R:5611|L:5606|R:5609|L:5604|R:5607|L:5601|R:5605|L:5602|R:5603"],
    [6.5, "branch5612", "branch5612", "branch5612_end", "Проход 5612–5624", "R:5612|L:5624=Туалет|R:5614|L:5622|R:5616|L:5620|-:5618"],
    [6.5, "branch5628", "branch5628", "branch5628_end", "Проход 5615–5634", "R:5628|L:5615|R:5630|L:5617|R:5632|L:5619|R:5634|L:5621|L:5623|-:5625"],
    [7.5, "wing5700", "wing5700", "corner5700", "Коридор 5702–5709", "L:5708|R:5709|L:5706|R:5707|L:5704|R:5705|R:5703|L:5702"],
    [7.5, "branch5710", "branch5710", "branch5710_end", "Проход 5710–5721", "R:5710|R:5712|L:5713|R:5714|L:5719|R:5716|L:5721|-:5718"],
    [7.5, "branch5711", "branch5711", "branch5711_end", "Проход 5711–5713", "L:5711|-:5713"],
];

// Стыки задаются отдельно от ориентиров: совпадение номера комнаты не создаёт проход.
const junctionExtensions: [number, string, string, string[]][] = [
    [3, "food3", "Холл у буфета", ["food3", "canteen3", "passage4", "stairs10_3"]],
    [3, "branch4300", "Развилка корпуса 4", ["branch4300", "branch4311", "branch4302", "stairs2_3"]],
    [3, "stairs2k3", "Лестница корпуса 2", ["hall3_main", "stairs2k_3"]],
    [4, "stairs2k4", "Лестница корпуса 2", ["stairs2k_4", "wing2400"]],
    [4, "stairs2_4", "Лестничная площадка корпуса 4", ["stairs2_4", "wing4400"]],
    [5, "landing5", "Лестничная площадка № 5", ["stairs5_5", "landing5_rooms", "main5", "wing6600"]],
    [5, "corner5", "Поворот у большой лестницы", ["corner5", "branch1517", "big_stairs5", "west5"]],
    [5, "small5", "Поворот у малой лестницы", ["small5", "branch1501", "wing1625"]],
    [5, "corner6600", "Поворот к корпусу 8", ["corner6600", "wing8100"]],
    [5, "corner8100", "Лестничная площадка корпуса 8", ["corner8100", "toilets8100", "stairs8_5"]],
    [5, "corner8102", "Поворот к аудиториям 8101 и 8102", ["corner8102", "branch8102"]],
    [5, "stairs2k5", "Лестница корпуса 2", ["stairs2k_5", "wing2500"]],
    [6, "landing6", "Лестничная площадка № 5", ["stairs5_6", "main6"]],
    [6, "corner6", "Поворот к аудиториям 1601 и 1602", ["corner6", "branch1601"]],
    [6, "stairs2k6", "Лестница корпуса 2", ["stairs2k_6", "wing2604"]],
    [6, "corner2604", "Развилка у аудитории 2604", ["corner2604", "branch2600", "branch2601"]],
    [6, "corner2601", "Поворот у аудитории 2601", ["corner2601", "wing2600"]],
    [6, "corner2611", "Поворот у аудитории 2611", ["corner2611", "branch2611b"]],
    [6, "corner2611b", "Поворот у аудитории 2611б", ["corner2611b", "branch2611v"]],
    [6, "stairs8_6", "Лестничная площадка корпуса 8", ["stairs8_6", "wing8200"]],
    [4.5, "landing45", "Лестничная площадка № 10", ["stairs10_4.5", "wing5400"]],
    [5.5, "landing55", "Лестничная площадка № 10", ["stairs10_5.5", "wing5500"]],
    [5.5, "corner5500", "Ответвление коридора 5500", ["corner5500", "branch5510"]],
    [6.5, "landing65", "Лестничная площадка № 10", ["stairs10_6.5", "wing5600"]],
    [6.5, "corner5600", "Развилка коридора 5600", ["corner5600", "branch5612", "branch5628"]],
    [7.5, "landing75", "Лестничная площадка № 10", ["stairs10_7.5", "wing5700"]],
    [7.5, "corner5700", "Развилка коридора 5700", ["corner5700", "branch5710", "branch5711"]],
];

const extensionXML = corridorExtensions.map(([floor, id, start, finish, name, rooms]) => `
    <Block floor="${floor}" building="Главный корпус">
        <Corridor id="${id}" start="${start}" finish="${finish}" name="${name}" to="${name}">
            ${rooms.split("|").map((room, index) => {
                const [side, value] = room.split(":");
                const [number, label] = value.split("=");
                const wall = side === "L" ? "left" : side === "R" ? "right" : "";
                const text = label ? `${label}${/^\d/.test(number) ? ` (${number})` : ""}` : `Аудитория ${number}`;
                return `<Joint wall="${wall}" id="landmark_${id}_${index}" text="${text}" to="${label || `аудитории ${number}`}"/>`;
            }).join("\n            ")}
        </Corridor>
    </Block>`).join("") + junctionExtensions.map(([floor, id, name, joints]) => `
    <Block floor="${floor}" building="Главный корпус">
        <Square id="junction_${id}" name="${name}" to="${name}">
            ${joints.map((joint, index) => `<Side dir="${["backward", "forward", "left", "right"][index]}"><Joint id="${joint}" text="${name}" to="${name}"/></Side>`).join("\n            ")}
        </Square>
    </Block>`).join("");

export const planXML = `<Plan object="VVSU">
    <Block building="Главный корпус">
        <Block floor="4" building="1">
            <Square id="landing_1" name="Лестничная площадка № 1" to="лестничной площадки № 1">
                <Side dir="backward">
                    <Joint id="1" text="Лестница" to="лестницы"/>
                </Side>
                <Side dir="right" type="window">
                    <Orient type="trash_bin" name="Урна для мусора" to="урны для мусора"/>
                    <Orient type="rest+charge" name="Диваны с зарядкой" to="диванов с зарядкой"/>
                </Side>
                <Side dir="forward">
                    <Orient type="door" name="Дверь" to="двери"/>
                    <Orient type="info_desk" name="Плакат героев" to="плаката героев"/>
                </Side>
                <Side dir="left">
                    <Part type="free">
                        <Joint id="2" text="Поворот" to="поворота"/>
                    </Part>
                    <Part type="wall">
                        <Orient type="fire_extinguisher" name="Огнетушитель на лестничной площадке № 1" to="огнетушителя на лестничной площадке № 1"/>
                    </Part>
                </Side>
            </Square>
            <Square id="square_2">
                <Side dir="backward" type="free">
                    <Joint id="2" text="Поворот" to="поворота"/>
                </Side>
                <Side dir="right" type="wall">
                    <Room num="1431"/>
                    <Orient type="rest+charge" name="Диван с зарядкой" to="дивана с зарядкой"/>
                    <Room num="1433"/>
                </Side>
                <Side dir="forward">
                    <Part type="wall"/>
                    <Part type="free">
                        <Joint id="3" text="Поворот" to="поворота"/>
                    </Part>
                </Side>
                <Side dir="left" type="wall">
                    <Room num="1426" name="Преподавательская кафедры ИТС № 1" to="преподавательской кафедры ИТС № 1"/>
                    <Room num="1424"/>
                </Side>
            </Square>
            <Square id="big_stairs4_link">
                <Side dir="backward"><Joint id="1" text="Большая лестница" to="большой лестницы"/></Side>
                <Side dir="forward"><Joint id="west4" text="Коридор к аудиториям 1401–1429" to="коридора к аудиториям 1401–1429"/></Side>
            </Square>
            <Corridor id="corridor_1" start="3" finish="4" name="Коридор № 1" to="коридора № 1">
                <Room wall="right" num="1435"/>
                <Room wall="left" num="1428" name="Подсобное помещение" to="подсобного помещения"/>
                <Room wall="left" num="1430" type="M" name="Мужской туалет" to="мужского туалета"/>
                <Room wall="right" num="1437"/>
                <Room wall="left" num="1432"/>
                <Room wall="left" num="1434"/>
                <Room wall="right" num="1439"/>
                <Room wall="left" num="1436"/>
                <Room wall="right" num="1441"/>
                <Orient wall="right" type="info_desk" name="Информационный стенд кафедры" to="информационного стенда кафедры"/>
                <Room wall="left" num="1438"/>
                <Room wall="right" num="1443" name="Кафедра математики и моделирования" to="кафедры математики и моделирования"/>
                <Room wall="right" num="1445"/>
                <Room wall="left" num="1440"/>
                <Room wall="right" num="1447"/>
                <Room wall="left" num="1442"/>
            </Corridor>
            <Square id="square_3">
                <Side dir="backward" type="free">
                    <Joint id="4" text="Поворот налево" to="поворота налево"/>
                </Side>
                <Side dir="forward" type="free">
                    <Joint id="5" text="Поворот направо" to="поворота направо"/>
                </Side>
                <Side dir="right" type="wall"/>
                <Side dir="left" type="free">
                    <Joint id="6" text="Поворот" to="поворота"/>
                </Side>
            </Square>
            <Square id="square_rest" name="Зона отдыха" to="зоны отдыха" cat="rest" desc="Два дивана по бокам, можно присесть и подождать. Окно впереди — ориентир на дневной свет.">
                <Side dir="backward" type="free">
                    <Joint id="6" text="Поворот" to="поворота"/>
                </Side>
                <Side dir="left" type="wall">
                    <Orient type="rest" name="Диван в зоне отдыха слева" to="дивана в зоне отдыха слева"/>
                </Side>
                <Side dir="right" type="wall">
                    <Orient type="rest" name="Диван в зоне отдыха справа" to="дивана в зоне отдыха справа"/>
                </Side>
                <Side dir="forward" type="window"/>
            </Square>
            <Corridor id="corridor_2" start="5" finish="7" name="Коридор № 2" to="коридора № 2">
                <Orient wall="left" type="fire_extinguisher" name="Огнетушитель в коридоре № 2" to="огнетушителя в коридоре № 2"/>
                <Orient wall="left" type="info_desk" name="План эвакуации" to="плана эвакуации"/>
                <Room wall="left" num="1444"/>
                <Room wall="right" num="1449"/>
                <Room wall="right" num="1451"/>
                <Room wall="left" num="1446" name="Зав. кафедрой ИТС" to="зав. кафедрой ИТС"/>
                <Room wall="right" num="1453"/>
                <Orient wall="left" type="info_desk" name="Схема этажа" to="схемы этажа"/>
                <Orient wall="left" type="info_desk" name="Информационный стенд кафедры ИТС" to="информационного стенда"/>
                <Room wall="left" num="1448" name="Преподавательская кафедры ИТС № 2" to="преподавательской кафедры ИТС № 2"/>
            </Corridor>
            <Square id="landing_2" name="Лестничная площадка № 2" to="лестничной площадки № 2">
                <Side dir="backward" type="free">
                    <Joint id="7" text="Лестница" to="лестницы"/>
                </Side>
                <Side dir="right" type="window">
                    <Orient type="rest" name="Диван у окна" to="дивана у окна"/>
                </Side>
                <Side dir="forward" type="wall">
                    <Room num="1457"/>
                    <Orient type="rest" name="Диван у аудитории 1457" to="дивана у аудитории 1457"/>
                </Side>
                <Side dir="left">
                    <Joint id="8" text="Лестница № 5" to="лестницы № 5"/>
                </Side>
            </Square>
        </Block>
        <Block floor="2" building="1">
            <Square id="landing_201" name="Лестничная площадка" to="лестничной площадки">
                <Side dir="backward">
                    <Joint id="201" text="Лестница" to="лестницы"/>
                    <Joint id="202" text="Лестница" to="лестницы"/>
                </Side>
                <Side dir="forward">
                    <Part type="free">
                        <Joint id="203" text="Поворот" to="поворота"/>
                    </Part>
                </Side>
                <Side dir="left"><Joint id="stairs5_2" text="Лестница № 5" to="лестницы № 5"/></Side>
                <Side dir="right"><Orient type="library" name="Библиотека" to="библиотеки"/></Side>
            </Square>
            <Corridor id="corridor_201" start="203" finish="204" name="Коридор" to="коридора" desc="Длинный коридор с аудиториями по обе стороны." photo="images/plan/2/rector_gallery_corridor.jpg">
                <Room wall="right" num="1201"/>
                <Joint wall="left" id="room_1202" text="Аудитория 1202" to="аудитории 1202"/>
                <Joint wall="left" id="room_1204" text="Аудитория 1204" to="аудитории 1204"/>
                <Room wall="right" num="1203" name="Директор института сервиса, моды и дизайна" to="директора института сервиса, моды и дизайна"/>
                <Room wall="right" num="1205" name="Методический кабинет" to="методического кабинета"/>
                <Joint wall="left" id="room_1206" text="Аудитория 1206" to="аудитории 1206"/>
                <Room wall="right" num="1207"/>
                <Joint wall="left" id="room_1208" text="Аудитория 1208" to="аудитории 1208"/>
                <Joint wall="right" id="room_1209" text="Аудитория 1209" to="аудитории 1209"/>
                <Room wall="left" num="1210"/>
                <Room wall="right" num="1211" name="Преподавательская" to="преподавательской"/>
                <Room wall="left" num="1212" name="Учебно-производственная мастерская" to="учебно-производственной мастерской"/>
                <Room wall="right" num="1213" name="Преподавательская" to="преподавательской"/>
                <Room wall="left" num="1214" name="Студенческое стилевое бюро" to="студенческого стилевого бюро"/>
                <Room wall="right" num="1215" name="Лаборатория испытания материалов" to="лаборатории испытания материалов"/>
                <Room wall="right" num="1215а"/>
                <Room wall="left" num="1216" name="Кафедра дизайна и технологий" to="кафедры дизайна и технологий"/>
                <Joint wall="left" id="room_1218" text="Аудитория 1218" to="аудитории 1218"/>
                <Room wall="left" num="1218а" name="Служба снабжения" to="службы снабжения"/>
                <Room wall="right" num="1219" name="Студенческий офис" to="студенческого офиса" desc="Обращаться по вопросам зачётов, справок и расписания."/>
                <Room wall="right" num="1221" name="Отдел заочного обучения и дистанционных технологий" to="отдела заочного обучения и дистанционных технологий"/>
                <Room wall="right" num="1221а"/>
                <Joint wall="left" id="room_1222" text="Аудитория 1222" to="аудитории 1222"/>
                <Room wall="right" num="1223" name="Директор департамента маркетинга и информационной политики" to="директора департамента маркетинга и информационной политики"/>
                <Room wall="left" num="1224" name="Отдел по профилактике коррупционных и иных правонарушений" to="отдела по профилактике коррупционных и иных правонарушений"/>
                <Joint wall="right" id="room_1225" text="Аудитория 1225" to="аудитории 1225"/>
                <Room wall="left" num="1226" name="Институт заочного обучения" to="института заочного обучения"/>
                <Room wall="left" num="1226а"/>
                <Room wall="left" num="1226б"/>
                <Room wall="right" num="1227"/>
                <Room wall="left" num="1228" name="Инженерно-землеустроительный отдел, Отдел комплектования" to="инженерно-землеустроительного отдела, отдела комплектования"/>
                <Joint wall="right" id="room_1229" text="Аудитория 1229" to="аудитории 1229"/>
                <Room wall="left" num="1230" name="Институт заочного обучения" to="института заочного обучения"/>
                <Room wall="right" num="1231" name="Региональный Центр Старт-карьера, Департамент делового сотрудничества и бизнес-партнёрства" to="регионального центра старт-карьера, департамента делового сотрудничества и бизнес-партнёрства"/>
                <Room wall="left" num="1232" name="Мастерская Промышленный дизайн" to="мастерской промышленный дизайн"/>
                <Room wall="left" num="1232а"/>
                <Room wall="left" num="1232б"/>
                <Room wall="right" num="1233"/>
                <Room wall="left" num="1234" name="Институт постдипломного образования" to="института постдипломного образования"/>
                <Room wall="right" num="1235" name="Цифровая библиотека" to="цифровой библиотеки"/>
                <Joint wall="left" id="room_1236" text="Аудитория 1236" to="аудитории 1236"/>
                <Room wall="right" num="1237"/>
                <Room wall="left" num="1238" name="Заведующий библиотекой" to="заведующего библиотекой"/>
                <Room wall="right" num="1239"/>
                <Room wall="right" num="1239а"/>
                <Room wall="left" num="1240"/>
                <Room wall="right" num="1241"/>
                <Room wall="left" num="1242"/>
                <Room wall="right" num="1242-3"/>
                <Room wall="left" num="1244"/>
            </Corridor>
        </Block>
        <Block floor="3" building="1">
            <Square id="landing_301" name="Лестничная площадка" to="лестничной площадки">
                <Side dir="backward">
                    <Joint id="301" text="Лестница" to="лестницы"/>
                    <Joint id="302" text="Лестница" to="лестницы"/>
                </Side>
                <Side dir="right" type="window"/>
                <Side dir="forward">
                    <Part type="free">
                        <Joint id="303" text="Поворот" to="поворота"/>
                    </Part>
                </Side>
                <Side dir="left">
                    <Part type="wall"/>
                </Side>
            </Square>
            <Square id="academic3_link">
                <Side dir="backward"><Joint id="303" text="Большая лестница" to="большой лестницы"/></Side>
                <Side dir="forward"><Joint id="304" text="Коридор с аудиториями" to="коридора с аудиториями"/></Side>
                <Side dir="right"><Joint id="stairs5_3" text="Лестница № 5" to="лестницы № 5"/></Side>
            </Square>
            <Square id="hall3" name="Холл у зимнего сада" to="холла у зимнего сада">
                <Side dir="backward"><Joint id="entry_2" text="Тамбур входа 2" to="тамбура входа 2"/></Side>
                <Side dir="forward"><Joint id="hall3_main" text="Проход мимо буфета" to="прохода мимо буфета"/></Side>
                <Side dir="right"><Joint id="hall3_academic" text="Коридор с аудиториями" to="коридора с аудиториями"/></Side>
                <Side dir="left"><Joint id="hall3_coffee" text="Кофейня" to="кофейни"/></Side>
            </Square>
            <Corridor id="entry2_tambour" start="exit_2" finish="entry_2" name="Тамбур входа 2" to="тамбура входа 2">
                <Joint wall="left" id="room_анд" text="Андеграунд" to="Андеграунда"/>
                <Joint wall="right" id="room_коф" text="Кофейня у входа" to="кофейни у входа"/>
                <Orient type="turnstile" name="Турникет входа 2" to="турникета входа 2"/>
            </Corridor>
            <Corridor id="coffee3" start="hall3_coffee" finish="coffee3_end" name="Проход к Точке кипения" to="прохода к Точке кипения">
                <Joint wall="left" id="room_коф2" text="Кофейня у фотозоны" to="кофейни у фотозоны"/>
                <Joint wall="right" id="room_1305" text="Точка кипения (1305)" to="Точки кипения"/>
                <Orient wall="left" type="space" name="Фотозона" to="фотозоны"/>
            </Corridor>
            <Corridor id="corridor_301" start="hall3_academic" finish="304" name="Коридор" to="коридора">
                <Room wall="right" num="1301"/>
                <Room wall="right" num="1303"/>
                <Room wall="right" num="1307"/>
                <Joint wall="right" id="room_1309" text="Аудитория 1309" to="аудитории 1309"/>
                <Room wall="left" num="1310"/>
                <Room wall="right" num="1311" name="Центр по работе с клиентами" to="центра по работе с клиентами"/>
                <Room wall="left" num="1312"/>
                <Room wall="right" num="1313" name="Центр Абитуриент, Заместитель проректора по учебно-воспитательной и научно-исследовательской работе" to="центра абитуриент, заместителя проректора по учебно-воспитательной и научно-исследовательской работе"/>
                <Room wall="left" num="1314" name="Отдел по работе со студентами" to="отдела по работе со студентами"/>
                <Room wall="right" num="1315" name="Учебная лаборатория центра Абитуриент" to="учебной лаборатории центра абитуриент"/>
                <Room wall="left" num="1316" name="Отдел по работе со студентами" to="отдела по работе со студентами"/>
                <Room wall="right" num="1317"/>
                <Room wall="right" num="1317а" name="Центр Абитуриент: Приёмная комиссия" to="центра абитуриент: приёмной комиссии"/>
                <Room wall="left" num="1318" name="Управление по работе со студентами" to="управления по работе со студентами"/>
                <Room wall="right" num="1319" name="Учебно-методическое управление" to="учебно-методического управления"/>
                <Room wall="right" num="1319а"/>
                <Room wall="right" num="1319б"/>
                <Room wall="right" num="1319в"/>
                <Room wall="left" num="1320" name="Копировальный центр" to="копировального центра"/>
                <Room wall="right" num="1321" name="Учебный отдел: Учебно-методическое управление" to="учебного отдела: учебно-методического управления"/>
                <Room wall="right" num="1321а"/>
                <Room wall="right" num="1321б"/>
                <Room wall="left" num="1322"/>
                <Room wall="right" num="1323" name="Академический колледж" to="академического колледжа"/>
                <Room wall="right" num="1323а"/>
                <Room wall="left" num="1324" name="Многофункциональный копи-центр" to="многофункционального копи-центра"/>
                <Room wall="right" num="1325" name="Академический колледж" to="академического колледжа"/>
                <Room wall="left" num="1326" name="Центр цифровых решений" to="центра цифровых решений"/>
                <Room wall="left" num="1326а"/>
                <Room wall="right" num="1327" name="Автономная некоммерческая организация" to="автономной некоммерческой организации"/>
                <Room wall="left" num="1328" name="Копировальный центр" to="копировального центра"/>
                <Room wall="right" num="1329"/>
                <Room wall="left" num="1330" name="ВГУЭС ТРЕВЕЛ молодёжный туроператор" to="вгуэс тревел молодёжного туроператора"/>
                <Room wall="right" num="1331" name="Отделы вычислительных сетей коммуникации связи" to="отделов вычислительных сетей коммуникации связи"/>
                <Joint wall="right" id="room_1333" text="Аудитория 1333" to="аудитории 1333"/>
                <Room wall="left" num="1332" name="Служба контроля и безопасности" to="службы контроля и безопасности"/>
                <Room wall="left" num="1334" name="Отделение подготовки переводчиков" to="отделения подготовки переводчиков"/>
                <Room wall="right" num="1335" name="Многофункциональная молодёжная площадка" to="многофункциональной молодёжной площадки"/>
                <Room wall="left" num="1336" name="Отдел закупок" to="отдела закупок"/>
                <Room wall="right" num="1337" name="Начальник отдела по работе с персоналом" to="начальника отдела по работе с персоналом"/>
                <Room wall="left" num="1338" name="Управление защиты государственной тайны и мобилизации" to="управления защиты государственной тайны и мобилизации"/>
                <Room wall="right" num="1339" name="Отдел кадров (Отдел по работе с персоналом)" to="отдела кадров (отдела по работе с персоналом)"/>
                <Joint wall="left" id="room_1340" text="Аудитория 1340" to="аудитории 1340"/>
                <Room wall="right" num="1341" name="Директор ресурсного информационно-методического центра" to="директора ресурсного информационно-методического центра"/>
                <Joint wall="left" id="room_1342" text="Аудитория 1342" to="аудитории 1342"/>
                <Room wall="right" num="1343" name="Общий отдел" to="общего отдела"/>
                <Room wall="left" num="1344" name="Аналитический отдел" to="аналитического отдела"/>
                <Room wall="right" num="1345" name="Финансовый отдел" to="финансового отдела"/>
                <Room wall="right" num="1345а"/>
                <Room wall="left" num="1346" name="Отдел эксплуатации, строительства и ремонта" to="отдела эксплуатации, строительства и ремонта"/>
                <Room wall="right" num="1347" name="Департамент бухгалтерского учёта" to="департамента бухгалтерского учёта"/>
                <Room wall="left" num="1348" name="Директор департамента научно-исследовательской работы" to="директора департамента научно-исследовательской работы"/>
                <Room wall="right" num="1349" name="Главный бухгалтер" to="главного бухгалтера"/>
                <Room wall="left" num="1350" name="Ученый секретарь, Ректорат" to="ученого секретаря, ректорат"/>
                <Room wall="right" num="1351" name="Материальный отдел" to="материального отдела"/>
                <Room wall="left" num="1352" name="Отдел экономики и планирования" to="отдела экономики и планирования"/>
                <Room wall="right" num="1353" name="Расчётный отдел" to="расчётного отдела"/>
                <Room wall="left" num="1354" name="Отдел ведения договоров" to="отдела ведения договоров"/>
                <Room wall="left" num="1356" name="Главный специалист по внутреннему аудиту" to="главного специалиста по внутреннему аудиту"/>
                <Room wall="left" num="1358" name="Департамент маркетинга и информационной политики" to="департамента маркетинга и информационной политики"/>
                <Room wall="right" num="1359"/>
                <Room wall="right" num="1359а"/>
                <Room wall="left" num="1360" name="Ректорат" to="ректората" desc="Приёмная ректора. Кabinеты 1360–1378 — весь ректорат на этом этаже."/>
                <Room wall="right" num="1361" name="Ректорат" to="ректората"/>
                <Room wall="left" num="1362" name="Ректорат" to="ректората"/>
                <Room wall="right" num="1363" name="Ректорат" to="ректората"/>
                <Room wall="left" num="1364" name="Ректорат" to="ректората"/>
                <Room wall="left" num="1366" name="Ректорат" to="ректората"/>
                <Room wall="left" num="1368" name="Ректорат" to="ректората"/>
                <Room wall="right" num="1369" name="Ректорат" to="ректората"/>
                <Room wall="left" num="1370" name="Ректорат" to="ректората"/>
                <Room wall="left" num="1372" name="Ректорат" to="ректората"/>
                <Room wall="left" num="1374" name="Ректорат" to="ректората"/>
                <Room wall="left" num="1376" name="Ректорат" to="ректората"/>
                <Room wall="left" num="1378"/>
            </Corridor>
        </Block>
        <Block floor="1" building="1">
            <Square id="entrance1_hall" name="Вестибюль входа 1" to="вестибюля входа 1">
                <Side dir="backward"><Joint id="exit_1" text="Вход 1" to="входа 1"/></Side>
                <Side dir="forward">
                    <Orient type="turnstile" name="Турникет входа 1" to="турникета входа 1"/>
                    <Joint id="stairs5_1" text="Лестница № 5" to="лестницы № 5"/>
                    <Joint id="lotos1" text="Проход к Лотосу" to="прохода к Лотосу"/>
                </Side>
                <Side dir="left"><Joint id="wardrobe1" text="Проход к гардеробу" to="прохода к гардеробу"/></Side>
            </Square>
            <Corridor id="lotos1" start="lotos1" finish="lotos1_end" name="Проход к Лотосу" to="прохода к Лотосу">
                <Joint wall="left" id="room_лотос" text="Лотос" to="Лотоса"/>
            </Corridor>
            <Corridor id="wardrobe1" start="wardrobe1" finish="corner1" name="Коридор у гардероба" to="коридора у гардероба">
                <Joint wall="left" id="room_гард" text="Гардероб" to="гардероба"/>
                <Joint wall="left" id="room_1140" text="Аудитория 1140" to="аудитории 1140"/>
                <Joint wall="right" id="room_1131" text="Аудитория 1131" to="аудитории 1131"/>
                <Joint wall="right" id="room_1129" text="Аудитория 1129" to="аудитории 1129"/>
                <Joint wall="right" id="room_1127" text="Аудитория 1127" to="аудитории 1127"/>
                <Joint wall="right" id="room_1125" text="Аудитория 1125" to="аудитории 1125"/>
                <Joint wall="left" id="room_1132" text="Аудитория 1132" to="аудитории 1132"/>
                <Joint wall="left" id="room_1130" text="Аудитория 1130" to="аудитории 1130"/>
                <Joint wall="right" id="room_1123" text="Аудитория 1123" to="аудитории 1123"/>
                <Joint wall="left" id="room_1128" text="Аудитория 1128" to="аудитории 1128"/>
                <Joint wall="left" id="room_1126" text="Аудитория 1126" to="аудитории 1126"/>
            </Corridor>
            <Square id="corner1">
                <Side dir="backward"><Joint id="corner1" text="Коридор у гардероба" to="коридора у гардероба"/></Side>
                <Side dir="left"><Joint id="branch1" text="Поворот к аудиториям 1119 и 1117" to="поворота к аудиториям 1119 и 1117"/></Side>
                <Side dir="forward"><Joint id="big_stairs1" text="Большая лестница" to="большой лестницы"/></Side>
                <Side dir="right"><Joint id="west1" text="Коридор с аудиториями" to="коридора с аудиториями"/></Side>
            </Square>
            <Corridor id="branch1" start="branch1" finish="branch1_end" name="Проход к аудиториям 1119 и 1117" to="прохода к аудиториям 1119 и 1117">
                <Joint wall="right" id="room_1119" text="Аудитория 1119" to="аудитории 1119"/>
                <Joint wall="left" id="room_1117" text="Аудитория 1117" to="аудитории 1117"/>
            </Corridor>
            <Corridor id="west1" start="west1" finish="west1_end" name="Коридор 1102–1115" to="коридора 1102–1115">
                <Joint wall="right" id="room_1115" text="Аудитория 1115" to="аудитории 1115"/>
                <Joint wall="right" id="room_1113" text="Аудитория 1113" to="аудитории 1113"/>
                <Joint wall="right" id="room_1111" text="Аудитория 1111" to="аудитории 1111"/>
                <Joint wall="left" id="room_1114" text="Аудитория 1114" to="аудитории 1114"/>
                <Joint wall="right" id="room_1109" text="Аудитория 1109" to="аудитории 1109"/>
                <Joint wall="right" id="room_1107" text="Аудитория 1107" to="аудитории 1107"/>
                <Joint wall="left" id="room_1112" text="Аудитория 1112" to="аудитории 1112"/>
                <Joint wall="right" id="room_1105" text="Аудитория 1105" to="аудитории 1105"/>
                <Joint wall="left" id="room_1102" text="Аудитория 1102" to="аудитории 1102"/>
            </Corridor>
        </Block>
        <Block floor="4" building="1">
            <Corridor id="west4" start="west4" finish="west4_end" name="Коридор 1401–1429" to="коридора 1401–1429">
                <Joint wall="left" id="room_1416" text="Аудитория 1416" to="аудитории 1416"/>
                <Joint wall="left" id="room_1414" text="Аудитория 1414" to="аудитории 1414"/>
                <Joint wall="right" id="room_1429" text="Аудитория 1429" to="аудитории 1429"/>
                <Joint wall="right" id="room_1427" text="Аудитория 1427" to="аудитории 1427"/>
                <Joint wall="right" id="room_1425" text="Аудитория 1425" to="аудитории 1425"/>
                <Joint wall="right" id="room_1423" text="Аудитория 1423" to="аудитории 1423"/>
                <Joint wall="right" id="room_1421" text="Аудитория 1421" to="аудитории 1421"/>
                <Joint wall="left" id="room_1412" text="Аудитория 1412" to="аудитории 1412"/>
                <Joint wall="right" id="room_1419" text="Аудитория 1419" to="аудитории 1419"/>
                <Joint wall="left" id="room_1410" text="Аудитория 1410" to="аудитории 1410"/>
                <Joint wall="right" id="room_1417" text="Аудитория 1417" to="аудитории 1417"/>
                <Joint wall="right" id="room_1415" text="Аудитория 1415" to="аудитории 1415"/>
                <Joint wall="left" id="room_1408" text="Аудитория 1408" to="аудитории 1408"/>
                <Joint wall="right" id="room_1411" text="Аудитория 1411" to="аудитории 1411"/>
                <Joint wall="left" id="room_1406" text="Аудитория 1406" to="аудитории 1406"/>
                <Joint wall="right" id="room_1405" text="Аудитория 1405" to="аудитории 1405"/>
                <Joint wall="left" id="room_1404" text="Аудитория 1404" to="аудитории 1404"/>
                <Joint wall="right" id="room_1403" text="Аудитория 1403" to="аудитории 1403"/>
                <Joint wall="left" id="room_1402" text="Аудитория 1402" to="аудитории 1402"/>
                <Joint wall="right" id="room_1401" text="Аудитория 1401" to="аудитории 1401"/>
            </Corridor>
        </Block>
        <Stairs id="staircase_1_2" start_id="big_stairs1" finish_id="201" building="1"/>
        <Stairs id="staircase_2_3" start_id="201" finish_id="301" building="1"/>
        <Stairs id="staircase_3_4" start_id="302" finish_id="1" building="1"/>
        <Stairs id="stairs5_1_2" start_id="stairs5_1" finish_id="stairs5_2" building="1"/>
        <Stairs id="stairs5_2_3" start_id="stairs5_2" finish_id="stairs5_3" building="1"/>
        <Stairs id="stairs5_3_4" start_id="stairs5_3" finish_id="8" building="1"/>
        <Stairs id="stairs5_4_5" start_id="8" finish_id="stairs5_5"/>
        <Stairs id="stairs5_5_6" start_id="stairs5_5" finish_id="stairs5_6"/>
        <Stairs id="big_stairs_4_5" start_id="1" finish_id="big_stairs5"/>
        <Stairs id="stairs2_3_4" start_id="stairs2_3" finish_id="stairs2_4"/>
        <Stairs id="stairs2k_3_4" start_id="stairs2k_3" finish_id="stairs2k_4"/>
        <Stairs id="stairs2k_4_5" start_id="stairs2k_4" finish_id="stairs2k_5"/>
        <Stairs id="stairs2k_5_6" start_id="stairs2k_5" finish_id="stairs2k_6"/>
        <Stairs id="stairs8_5_6" start_id="stairs8_5" finish_id="stairs8_6"/>
        <Stairs id="stairs10_3_45" start_id="stairs10_3" finish_id="stairs10_4.5"/>
        <Stairs id="stairs10_45_55" start_id="stairs10_4.5" finish_id="stairs10_5.5"/>
        <Stairs id="stairs10_55_65" start_id="stairs10_5.5" finish_id="stairs10_6.5"/>
        <Stairs id="stairs10_65_75" start_id="stairs10_6.5" finish_id="stairs10_7.5"/>
    </Block>
    ${extensionXML}
    <Exit id="exit_1" text="Вход 1" to="входа 1" desc="Вход на первом этаже, рядом с турникетом и проходом к гардеробу."/>
    <Exit id="exit_2" text="Вход 2" to="входа 2" desc="Вход на третьем этаже через тамбур и турникет к зимнему саду."/>
</Plan>`;
