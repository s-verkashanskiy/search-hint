// переписать       process.env.MONGODB_WRITE_CONNECTION_STRING,
// c https://docs.nestjs.com/techniques/mongodb
//
// если используются константы, то вынести и в файл index.ts в папке consts в папке модуля
//
// использовать вместо библиотеки '@elastic/elasticsearch' https://github.com/nestjs/elasticsearch
//
// перезасеять mongoDB по примеру:
// [
//   {
//     id: ObjectID(0),
//     text: 'Россия'
//   },
//   {
//     id: ObjectID(1),
//     parent: ObjectID(0),
//     text: 'Москвская область'
//   },
//   {
//     id: ObjectID(2),
//     parent: ObjectID(1),
//     text: 'Москва'
//   },
//   {
//     id: ObjectID(3),
//     parent: ObjectID(2),
//     text: 'ул Иванова'
//   },
// ]
// перезасеять elasticsearch так, чтобы ... { text: "Россия Московская область Москва ул Иванова", id: ObjectID(3) }
