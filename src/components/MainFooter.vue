<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section col-12 col-md-4">
          <h4>About Us</h4>
          <p>
            Our organisation is committed to helping elderly in need. Join us in making a
            difference.
          </p>
        </div>
        <div class="footer-section col-12 col-md-4">
          <h4>Contact Us</h4>
          <p>Email: contact@seniorassistancehub.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
        <div class="footer-section col-12 col-md-4">
          <h4>Follow Us</h4>
          <ul class="social-links">
            <li><a href="https://facebook.com">Facebook</a></li>
            <li><a href="https://twitter.com">Twitter</a></li>
            <li><a href="https://instagram.com">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 Senior Assistance Hub. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: #f8f9fa;
  color: #6c757d;
  padding: 20px 0;
  text-align: center;
  font-family: 'Arial', sans-serif;
}

.container {
  background-color: rgb(228, 248, 236);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.footer-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  text-align: left;
  padding: 20px;
}

.footer-section {
  flex: 1 1 290px;
  margin-bottom: 20px;
}

.footer-section h4 {
  color: #343a40;
  margin-bottom: 10px;
}

.social-links {
  list-style: none;
  padding: 0;
  text-align: center;
}

.social-links li {
  display: inline;
  margin-right: 10px;
}

.social-links a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #0056b3;
}

.footer-bottom {
  border-top: 1px solid #dee2e6;
  padding-top: 10px;
  font-size: 0.85em;
  opacity: 0.75;
}
</style>
