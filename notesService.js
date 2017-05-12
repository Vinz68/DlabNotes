/// <reference path="~/Scripts/_references.js" />

(function () {
    var notesService = function ($rootScope, $http) {

        // Connection to the Mobile Service (in the Azure Cloud)
        var MobileServiceClient = WindowsAzure.MobileServiceClient;
        var client = new MobileServiceClient(
            'https://[your API url].azure-mobile.net/',  // API url
            '[your API key]');                           // API key

        // The database-table which contains the Notes
        var notesTable = client.getTable('Notes');

        // Start with empty data container.
        notesService.data = {};


        // Gets the list of notes from JSON file
        var getNotesJSON = function () {
            return $http.get('JSON/localNotes.json')
                   .then(function (response) {
                       return response.data;
                   });
        };

        // Get the list of notes from the Azure database
        var getNotesAzure = function () {
            return notesTable.where({
                __deleted: false
            }).read().then(function (items) {
                notesService.data.notes = items;
                return notesService.data;
            });
        };


        // Add a new note into the Azure database 
        var addNoteAzure = function (notesList) {
            return notesTable.insert({
                notetext: notesList.addNoteText
                }).then(function (insertedRecord) {
                    return insertedRecord;
                });
        };


        // Delete an existing note from Azure DB
        var deleteNoteAzure = function (note) {
            notesTable.del({
                id: note.id
            }).done(function () {
            }, function (err) {
                alert("Error: " + err);
            });
        };


        return {
            getNotesJSON: getNotesJSON,
            getNotesAzure: getNotesAzure,
            addNoteAzure: addNoteAzure,
            deleteNoteAzure: deleteNoteAzure
        };

    };


    var module = angular.module("AngularNotesVibe");

    /* register a service within Angular (can be in many ways...)*/
    module.factory("notesService", notesService);


})();

