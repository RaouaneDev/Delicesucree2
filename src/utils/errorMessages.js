// Messages d'erreur pour le panier
export const cartErrors = {
    emptyCart: "Votre panier est vide",
    invalidQuantity: "La quantité sélectionnée n'est pas valide",
    productUnavailable: "Ce produit n'est plus disponible",
    maxQuantityReached: "Quantité maximale atteinte pour ce produit",
    minQuantityReached: "Quantité minimale est 1",
    addError: "Erreur lors de l'ajout au panier",
    removeError: "Erreur lors de la suppression du produit",
    updateError: "Erreur lors de la mise à jour du panier",
    stockLimit: "Stock insuffisant pour ce produit",
    invalidProduct: "Produit non valide ou indisponible"
};

// Messages d'erreur pour le formulaire client
export const formErrors = {
    // Champs requis
    required: {
        firstName: "Le prénom est requis",
        lastName: "Le nom est requis",
        email: "L'email est requis",
        phone: "Le numéro de téléphone est requis",
        address: "L'adresse est requise",
        postalCode: "Le code postal est requis",
        city: "La ville est requise"
    },
    
    // Format invalide
    invalid: {
        firstName: "Prénom invalide (lettres uniquement)",
        lastName: "Nom invalide (lettres uniquement)",
        email: "Format d'email invalide",
        phone: "Format de téléphone invalide (10 chiffres)",
        postalCode: "Code postal invalide (5 chiffres)",
        city: "Nom de ville invalide",
        address: "Adresse invalide"
    },
    
    // Longueur
    length: {
        tooShort: {
            firstName: "Prénom trop court (min. 2 caractères)",
            lastName: "Nom trop court (min. 2 caractères)",
            address: "Adresse trop courte",
            city: "Nom de ville trop court"
        },
        tooLong: {
            firstName: "Prénom trop long (max. 50 caractères)",
            lastName: "Nom trop long (max. 50 caractères)",
            email: "Email trop long",
            address: "Adresse trop longue",
            city: "Nom de ville trop long"
        }
    }
};

// Messages d'erreur pour le processus de commande
export const checkoutErrors = {
    paymentFailed: "Le paiement a échoué",
    orderFailed: "Erreur lors de la création de la commande",
    invalidForm: "Veuillez remplir tous les champs obligatoires",
    serverError: "Erreur de connexion au serveur",
    sessionExpired: "Votre session a expiré",
    invalidAddress: "Adresse de livraison invalide",
    invalidTotal: "Erreur dans le calcul du total"
};
