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
            <Corridor id="corridor_1" start="3" finish="4" name="Коридор № 1" to="коридора № 1">
                <Room wall="right" num="1435"/>
                <Room wall="left" num="1428" name="Подсобное помещение" to="подсобного помещения"/>
                <Room wall="left" num="1430" type="M" name="Мужской туалет" to="мужского туалета"/>
                <Room wall="right" num="1437"/>
                <Room wall="left" num="1432"/>
                <Room wall="left" num="1434"/>
                <Room wall="right" num="1439"/>
                <Room wall="left" num="1436"/>
                <Room wall="right" num="1431"/>
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
            <Square id="square_rest" name="Зона отдыха" to="зоны отдыха" cat="rest">
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
                    <Joint id="8" text="Лестница" to="лестницы"/>
                </Side>
            </Square>
        </Block>
        <Block floor="2" building="1">
            <Square id="landing_201" name="Лестничная площадка" to="лестничной площадки">
                <Side dir="backward">
                    <Joint id="201" text="Лестница" to="лестницы"/>
                    <Joint id="202" text="Лестница" to="лестницы"/>
                </Side>
                <Side dir="right" type="window"/>
                <Side dir="forward">
                    <Part type="free">
                        <Joint id="203" text="Поворот" to="поворота"/>
                    </Part>
                </Side>
                <Side dir="left">
                    <Part type="wall"/>
                </Side>
            </Square>
            <Corridor id="corridor_201" start="203" finish="204" name="Коридор" to="коридора">
                <Room wall="right" num="1201"/>
                <Room wall="right" num="1203" name="Директор института сервиса, моды и дизайна" to="директора института сервиса, моды и дизайна"/>
                <Room wall="right" num="1205" name="Методический кабинет" to="методического кабинета"/>
                <Room wall="right" num="1207"/>
                <Room wall="left" num="1210"/>
                <Room wall="right" num="1211" name="Преподавательская" to="преподавательской"/>
                <Room wall="left" num="1212" name="Учебно-производственная мастерская" to="учебно-производственной мастерской"/>
                <Room wall="right" num="1213" name="Преподавательская" to="преподавательской"/>
                <Room wall="left" num="1214" name="Студенческое стилевое бюро" to="студенческого стилевого бюро"/>
                <Room wall="right" num="1215" name="Лаборатория испытания материалов" to="лаборатории испытания материалов"/>
                <Room wall="right" num="1215а"/>
                <Room wall="left" num="1216" name="Кафедра дизайна и технологий" to="кафедры дизайна и технологий"/>
                <Room wall="left" num="1218а" name="Служба снабжения" to="службы снабжения"/>
                <Room wall="right" num="1219" name="Студенческий офис" to="студенческого офиса"/>
                <Room wall="right" num="1221" name="Отдел заочного обучения и дистанционных технологий" to="отдела заочного обучения и дистанционных технологий"/>
                <Room wall="right" num="1221а"/>
                <Room wall="right" num="1223" name="Директор департамента маркетинга и информационной политики" to="директора департамента маркетинга и информационной политики"/>
                <Room wall="left" num="1224" name="Отдел по профилактике коррупционных и иных правонарушений" to="отдела по профилактике коррупционных и иных правонарушений"/>
                <Room wall="left" num="1226" name="Институт заочного обучения" to="института заочного обучения"/>
                <Room wall="left" num="1226а"/>
                <Room wall="left" num="1226б"/>
                <Room wall="right" num="1227"/>
                <Room wall="left" num="1228" name="Инженерно-землеустроительный отдел, Отдел комплектования" to="инженерно-землеустроительного отдела, отдела комплектования"/>
                <Room wall="left" num="1230" name="Институт заочного обучения" to="института заочного обучения"/>
                <Room wall="right" num="1231" name="Региональный Центр Старт-карьера, Департамент делового сотрудничества и бизнес-партнёрства" to="регионального центра старт-карьера, департамента делового сотрудничества и бизнес-партнёрства"/>
                <Room wall="left" num="1232" name="Мастерская Промышленный дизайн" to="мастерской промышленный дизайн"/>
                <Room wall="left" num="1232а"/>
                <Room wall="left" num="1232б"/>
                <Room wall="right" num="1233"/>
                <Room wall="left" num="1234" name="Институт постдипломного образования" to="института постдипломного образования"/>
                <Room wall="right" num="1235" name="Цифровая библиотека" to="цифровой библиотеки"/>
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
            <Corridor id="corridor_301" start="303" finish="304" name="Коридор" to="коридора">
                <Room wall="right" num="1301"/>
                <Room wall="right" num="1303"/>
                <Room wall="right" num="1305" name="Точка кипения" to="точки кипения"/>
                <Room wall="right" num="1307"/>
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
                <Room wall="left" num="1332" name="Служба контроля и безопасности" to="службы контроля и безопасности"/>
                <Room wall="left" num="1334" name="Отделение подготовки переводчиков" to="отделения подготовки переводчиков"/>
                <Room wall="right" num="1335" name="Многофункциональная молодёжная площадка" to="многофункциональной молодёжной площадки"/>
                <Room wall="left" num="1336" name="Отдел закупок" to="отдела закупок"/>
                <Room wall="right" num="1337" name="Начальник отдела по работе с персоналом" to="начальника отдела по работе с персоналом"/>
                <Room wall="left" num="1338" name="Управление защиты государственной тайны и мобилизации" to="управления защиты государственной тайны и мобилизации"/>
                <Room wall="right" num="1339" name="Отдел кадров (Отдел по работе с персоналом)" to="отдела кадров (отдела по работе с персоналом)"/>
                <Room wall="right" num="1341" name="Директор ресурсного информационно-методического центра" to="директора ресурсного информационно-методического центра"/>
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
                <Room wall="left" num="1360" name="Ректорат" to="ректората"/>
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
        <Stairs id="staircase_2_3" start_id="201" finish_id="301" building="1"/>
        <Stairs id="staircase_3_4" start_id="302" finish_id="1" building="1"/>
    </Block>
</Plan>`;
