/// <reference path="~/Scripts/_references.js" />

(function () {
    var app = angular.module("AngularNotesVibe", [] );

    var NotesController = function ($scope, notesService) {
        var notesList = this;

        notesList.notes = [
            { "notetext": "Loading notes from Azure-Server [Please wait...]", done: false }
        ];

        notesList.addNote = function () {
            notesService.addNoteAzure(notesList).then(onAddNoteComplete, onError);
            notesList.addNoteText = '';
        };

        notesList.deleteNote = function (note) {
            notesService.deleteNoteAzure(note);
            notesList.notes.splice(notesList.notes.indexOf(note), 1);
        }

        onError = function (reason) {
            alert("Error fetching data from Azure-Database")
            $scope.error = "Could not fetch the data";
        };

        onNotesComplete = function (data) {

            // Notes comming in (async) from Azure Database 
            notesList.notes = data.notes;

            // update the View
            $scope.$apply();
        };


        onAddNoteComplete = function (insertedRecord) {

            // Note has been inserted into Azure Database ; add to View
            notesList.notes.push(insertedRecord);

            // update the View
            $scope.$apply();
        };


        $scope.message = "DLAB - Notes";
        notesList.addNoteText = '';


        // Read Notes from JSON file
        //notesService.getNotesJSON().then(onNotesComplete, onError)

        // Read Notes from AZURE DB (async)
        notesService.getNotesAzure().then(onNotesComplete, onError);
    };

    app.controller("NotesController",  NotesController);

}());






